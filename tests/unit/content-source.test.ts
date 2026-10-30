import { describe, expect, it } from "vitest";

import {
  ContentSourceConfigurationError,
  resolveContentSource,
} from "@/server/repositories/content-source";

describe("resolveContentSource", () => {
  it("usa demo quando não há banco nem preferência", () => {
    expect(resolveContentSource({})).toBe("demo");
  });

  it("usa database automaticamente quando há DATABASE_URL", () => {
    expect(resolveContentSource({ DATABASE_URL: "postgresql://x" })).toBe("database");
  });

  it("respeita CONTENT_SOURCE=demo mesmo com banco", () => {
    expect(resolveContentSource({ CONTENT_SOURCE: "demo", DATABASE_URL: "postgresql://x" })).toBe(
      "demo",
    );
  });

  it("falha alto ao pedir database sem DATABASE_URL", () => {
    expect(() => resolveContentSource({ CONTENT_SOURCE: "database" })).toThrow(
      ContentSourceConfigurationError,
    );
  });
});
