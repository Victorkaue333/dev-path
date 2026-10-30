// @vitest-environment node
// jose exige Uint8Array do realm Node; o jsdom cria outro realm e quebra a verificação de tipo.
import { describe, expect, it } from "vitest";

import { signSessionToken, verifySessionToken } from "@/server/auth/session-token";

const SECRET = "segredo-de-teste-com-mais-de-32-caracteres-ok";
const session = { adminId: "adm_1", email: "a@devpath.dev", name: "Admin", role: "OWNER" as const };

describe("session token", () => {
  it("assina e verifica com o mesmo segredo", async () => {
    const token = await signSessionToken(session, SECRET, 1);
    const verified = await verifySessionToken(token, SECRET);
    expect(verified).toMatchObject(session);
    expect(verified?.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("rejeita segredo diferente, token ausente e token adulterado", async () => {
    const token = await signSessionToken(session, SECRET, 1);
    expect(
      await verifySessionToken(token, "outro-segredo-com-32-caracteres-no-minimo!"),
    ).toBeNull();
    expect(await verifySessionToken(undefined, SECRET)).toBeNull();
    expect(await verifySessionToken(token, undefined)).toBeNull();
    expect(await verifySessionToken(`${token}x`, SECRET)).toBeNull();
  });
});
