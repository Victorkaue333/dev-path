import { describe, expect, it } from "vitest";

import { analyticsEventSchema, toExternalHost } from "@/features/analytics/schemas";

describe("analyticsEventSchema", () => {
  it("aceita um evento mínimo válido", () => {
    const result = analyticsEventSchema.safeParse({ type: "PAGE_VIEW", path: "/carreiras" });
    expect(result.success).toBe(true);
  });

  it("rejeita path com query string ou externo", () => {
    expect(analyticsEventSchema.safeParse({ type: "PAGE_VIEW", path: "/x?a=1" }).success).toBe(
      false,
    );
    expect(
      analyticsEventSchema.safeParse({ type: "PAGE_VIEW", path: "https://x.com/" }).success,
    ).toBe(false);
  });

  it("rejeita campos extras (sem identificadores de visitante)", () => {
    const result = analyticsEventSchema.safeParse({
      type: "PAGE_VIEW",
      path: "/",
      userId: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita tipo desconhecido e slug inválido", () => {
    expect(analyticsEventSchema.safeParse({ type: "LOGIN", path: "/" }).success).toBe(false);
    expect(
      analyticsEventSchema.safeParse({
        type: "COURSE_CLICK",
        path: "/cursos",
        targetSlug: "Bad Slug",
      }).success,
    ).toBe(false);
  });
});

describe("toExternalHost", () => {
  it("mantém apenas o host", () => {
    expect(toExternalHost("https://user:pw@developer.mozilla.org/pt-BR/docs?x=1#y")).toBe(
      "developer.mozilla.org",
    );
  });

  it("retorna undefined para URL inválida", () => {
    expect(toExternalHost("não é url")).toBeUndefined();
  });
});
