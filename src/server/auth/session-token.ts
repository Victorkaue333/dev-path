import { jwtVerify, SignJWT } from "jose";

/**
 * Token de sessão administrativa (JWT HS256) — funções puras, sem acesso a cookies.
 * Usadas pelo servidor (src/server/auth/session.ts) e pelo proxy (src/proxy.ts).
 * Decisão registrada em docs/DECISIONS.md.
 */

export const SESSION_COOKIE_NAME = "devpath_admin_session";
const ISSUER = "devpath";
const AUDIENCE = "devpath-admin";

export type AdminRole = "OWNER" | "EDITOR";

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  /** Epoch em segundos. */
  expiresAt: number;
}

export function secretToKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  session: Omit<AdminSession, "expiresAt">,
  secret: string,
  ttlHours: number,
): Promise<string> {
  const ttlSeconds = Math.max(1, Math.floor(ttlHours * 3600));
  return new SignJWT({ email: session.email, name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(session.adminId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secretToKey(secret));
}

/** Retorna a sessão ou null para token ausente, inválido, expirado ou com claims incompletas. */
export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
): Promise<AdminSession | null> {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, secretToKey(secret), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ["HS256"],
    });
    const role = payload.role;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (role !== "OWNER" && role !== "EDITOR") ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    return {
      adminId: payload.sub,
      email: payload.email,
      name: payload.name,
      role,
      expiresAt: payload.exp,
    };
  } catch {
    return null;
  }
}
