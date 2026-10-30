import { describe, expect, it, vi } from "vitest";

import {
  type AdminRecord,
  type AuthenticateDeps,
  authenticateAdmin,
} from "@/server/auth/authenticate";
import { createMemoryRateLimiter } from "@/server/auth/rate-limit";

const admin: AdminRecord = {
  id: "adm_1",
  email: "admin@devpath.dev",
  name: "Admin",
  role: "OWNER",
  passwordHash: "hash",
  isActive: true,
};

function deps(overrides: Partial<AuthenticateDeps> = {}): AuthenticateDeps {
  return {
    isAuthConfigured: true,
    isDatabaseConfigured: true,
    rateLimiter: createMemoryRateLimiter({ max: 5, windowMs: 60_000 }),
    findAdminByEmail: vi.fn(async (email: string) => (email === admin.email ? admin : null)),
    verifyPassword: vi.fn(
      async (plain: string, hash: string) => plain === "senha-correta" && hash === "hash",
    ),
    ...overrides,
  };
}

const input = { email: "Admin@DevPath.dev", password: "senha-correta", clientKey: "ip-1" };

describe("authenticateAdmin (fail-closed)", () => {
  it("bloqueia quando AUTH_SECRET não está configurado, antes de consultar o banco", async () => {
    const d = deps({ isAuthConfigured: false });
    const result = await authenticateAdmin(input, d);
    expect(result).toEqual({ ok: false, reason: "auth_not_configured" });
    expect(d.findAdminByEmail).not.toHaveBeenCalled();
  });

  it("bloqueia quando o banco não está configurado", async () => {
    const d = deps({ isDatabaseConfigured: false });
    const result = await authenticateAdmin(input, d);
    expect(result).toEqual({ ok: false, reason: "db_unavailable" });
    expect(d.findAdminByEmail).not.toHaveBeenCalled();
  });

  it("autentica com credenciais válidas, normalizando o e-mail", async () => {
    const d = deps();
    const result = await authenticateAdmin(input, d);
    expect(result).toEqual({
      ok: true,
      admin: { id: "adm_1", email: admin.email, name: "Admin", role: "OWNER" },
    });
    expect(d.findAdminByEmail).toHaveBeenCalledWith("admin@devpath.dev");
  });

  it("devolve a mesma razão para e-mail inexistente e senha errada", async () => {
    const d = deps();
    const wrongEmail = await authenticateAdmin({ ...input, email: "x@devpath.dev" }, d);
    const wrongPassword = await authenticateAdmin({ ...input, password: "errada-errada" }, d);
    expect(wrongEmail).toEqual({ ok: false, reason: "invalid_credentials" });
    expect(wrongPassword).toEqual({ ok: false, reason: "invalid_credentials" });
    // Mesmo sem e-mail, a senha é comparada contra um hash (tempo de resposta uniforme).
    expect(d.verifyPassword).toHaveBeenCalledTimes(2);
  });

  it("rejeita administradores inativos", async () => {
    const d = deps({ findAdminByEmail: vi.fn(async () => ({ ...admin, isActive: false })) });
    expect(await authenticateAdmin(input, d)).toEqual({ ok: false, reason: "invalid_credentials" });
  });

  it("limita tentativas por chave e zera o contador após sucesso", async () => {
    const d = deps({ rateLimiter: createMemoryRateLimiter({ max: 2, windowMs: 60_000 }) });
    await authenticateAdmin({ ...input, password: "errada-errada" }, d);
    await authenticateAdmin({ ...input, password: "errada-errada" }, d);
    const limited = await authenticateAdmin(input, d);
    expect(limited.ok).toBe(false);
    if (!limited.ok) expect(limited.reason).toBe("rate_limited");

    d.rateLimiter.reset("ip-1");
    const ok = await authenticateAdmin(input, d);
    expect(ok.ok).toBe(true);
    expect(d.rateLimiter.hit("ip-1").remaining).toBe(1);
  });
});
