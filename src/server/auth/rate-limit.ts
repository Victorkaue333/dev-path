/**
 * Limitador de tentativas em memória (janela deslizante).
 *
 * LIMITAÇÃO CONHECIDA: vale por instância/processo. Em ambiente serverless (Vercel) cada
 * instância tem o próprio contador, então ele reduz abuso mas não o impede por completo.
 * A versão com armazenamento compartilhado (KV ou tabela no PostgreSQL) está registrada
 * como pendência em docs/Security-Guide.md e docs/DECISIONS.md.
 *
 * Nada aqui é persistido: a chave (normalmente IP) existe só enquanto a janela dura.
 */
export interface RateLimiter {
  /** Registra uma tentativa e informa se ainda está dentro do limite. */
  hit(key: string, now?: number): { allowed: boolean; remaining: number; retryAfterMs: number };
  reset(key: string): void;
}

export interface RateLimitOptions {
  /** Máximo de tentativas por janela. */
  max: number;
  /** Tamanho da janela em milissegundos. */
  windowMs: number;
}

export function createMemoryRateLimiter({ max, windowMs }: RateLimitOptions): RateLimiter {
  const buckets = new Map<string, number[]>();

  function prune(timestamps: number[], now: number): number[] {
    const threshold = now - windowMs;
    return timestamps.filter((t) => t > threshold);
  }

  return {
    hit(key, now = Date.now()) {
      const current = prune(buckets.get(key) ?? [], now);
      if (current.length >= max) {
        buckets.set(key, current);
        const oldest = current[0] ?? now;
        return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, oldest + windowMs - now) };
      }
      current.push(now);
      buckets.set(key, current);
      // Limpeza oportunista para não crescer indefinidamente.
      if (buckets.size > 10_000) {
        for (const [k, v] of buckets) {
          if (prune(v, now).length === 0) buckets.delete(k);
        }
      }
      return { allowed: true, remaining: max - current.length, retryAfterMs: 0 };
    },
    reset(key) {
      buckets.delete(key);
    },
  };
}

/** Login do painel: 5 tentativas a cada 15 minutos por chave. */
export const loginRateLimiter = createMemoryRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });

/** Endpoint de analytics: 120 eventos por minuto por chave. */
export const analyticsRateLimiter = createMemoryRateLimiter({ max: 120, windowMs: 60 * 1000 });

/** Extrai uma chave de cliente a partir dos cabeçalhos (primeiro IP de X-Forwarded-For). Não é persistida. */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "unknown";
}
