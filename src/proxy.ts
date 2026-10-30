import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/server/auth/session-token";

/**
 * Primeira barreira do painel: sem sessão válida, redireciona para /admin/login.
 * A verificação que vale é a do servidor (requireAdminSession no layout admin);
 * aqui evitamos renderizar qualquer coisa do painel para quem não está autenticado.
 * Lê process.env diretamente porque o proxy não deve depender de módulos `server-only`.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token, process.env.AUTH_SECRET);

  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      // Cookie presente mas inválido/expirado: limpa para evitar loops.
      response.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
