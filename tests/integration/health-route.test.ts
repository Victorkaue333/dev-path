import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

/** Integração leve: executa o Route Handler real sem servidor HTTP. */
describe("GET /api/health", () => {
  it("responde ok com fonte de conteúdo e estado do banco", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(["demo", "database"]).toContain(body.contentSource);
    expect(["configured", "not_configured"]).toContain(body.database);
  });
});
