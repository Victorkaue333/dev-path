import { describe, expect, it } from "vitest";

import { clientKeyFromHeaders, createMemoryRateLimiter } from "@/server/auth/rate-limit";

describe("createMemoryRateLimiter", () => {
  it("bloqueia após o máximo dentro da janela e libera depois", () => {
    const limiter = createMemoryRateLimiter({ max: 3, windowMs: 1000 });
    const t0 = 1_000_000;

    expect(limiter.hit("ip", t0).allowed).toBe(true);
    expect(limiter.hit("ip", t0 + 10).allowed).toBe(true);
    expect(limiter.hit("ip", t0 + 20).allowed).toBe(true);

    const blocked = limiter.hit("ip", t0 + 30);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);

    expect(limiter.hit("ip", t0 + 1001).allowed).toBe(true);
  });

  it("isola chaves e permite reset", () => {
    const limiter = createMemoryRateLimiter({ max: 1, windowMs: 1000 });
    expect(limiter.hit("a", 0).allowed).toBe(true);
    expect(limiter.hit("b", 0).allowed).toBe(true);
    expect(limiter.hit("a", 1).allowed).toBe(false);
    limiter.reset("a");
    expect(limiter.hit("a", 2).allowed).toBe(true);
  });
});

describe("clientKeyFromHeaders", () => {
  it("usa o primeiro IP de x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" });
    expect(clientKeyFromHeaders(headers)).toBe("203.0.113.5");
  });

  it("cai para 'unknown' sem cabeçalhos", () => {
    expect(clientKeyFromHeaders(new Headers())).toBe("unknown");
  });
});
