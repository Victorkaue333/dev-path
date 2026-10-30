import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/analytics/events/route";

function post(body: unknown, headers: Record<string, string> = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return new NextRequest("http://localhost/api/analytics/events", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.7", ...headers },
    body: raw,
  });
}

describe("POST /api/analytics/events", () => {
  it("aceita evento válido com 202 e sem corpo (sem banco, descarta)", async () => {
    const response = await POST(post({ type: "PAGE_VIEW", path: "/roadmaps" }));
    expect(response.status).toBe(202);
    expect(await response.text()).toBe("");
  });

  it("rejeita payload inválido com 400 e lista de problemas", async () => {
    const response = await POST(post({ type: "PAGE_VIEW", path: "/x?y=1", userId: "abc" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("validation_error");
    expect(Array.isArray(body.error.issues)).toBe(true);
  });

  it("rejeita JSON malformado com 400", async () => {
    const response = await POST(post("{nope"));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("invalid_json");
  });

  it("rejeita corpo grande com 413", async () => {
    const response = await POST(
      post({ type: "PAGE_VIEW", path: "/" }, { "content-length": "999999" }),
    );
    expect(response.status).toBe(413);
  });
});
