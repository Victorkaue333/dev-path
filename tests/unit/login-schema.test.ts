import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/admin/schemas/login";

describe("loginSchema", () => {
  it("normaliza o e-mail para minúsculas", () => {
    const result = loginSchema.safeParse({
      email: "  Admin@DevPath.Dev ",
      password: "senha-segura-123",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("admin@devpath.dev");
  });

  it("rejeita e-mail inválido e senha curta", () => {
    const result = loginSchema.safeParse({ email: "nao-e-email", password: "curta" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("email");
      expect(paths).toContain("password");
    }
  });
});
