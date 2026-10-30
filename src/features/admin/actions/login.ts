"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isAuthConfigured, isDatabaseConfigured } from "@/config/env";
import { findAdminByEmail, touchLastLogin } from "@/server/auth/admin-repository";
import { authenticateAdmin, authFailureMessages } from "@/server/auth/authenticate";
import { verifyPassword } from "@/server/auth/password";
import { clientKeyFromHeaders, loginRateLimiter } from "@/server/auth/rate-limit";
import { createAdminSession, destroyAdminSession } from "@/server/auth/session";

import { type LoginFormState, loginSchema } from "../schemas/login";

/**
 * Server Action de login. Validação com Zod, autenticação fail-closed e sessão em cookie httpOnly.
 * Server Actions já verificam o cabeçalho Origin (proteção CSRF nativa do Next.js).
 */
export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: LoginFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "email" || field === "password") fieldErrors[field] ??= issue.message;
    }
    return { status: "error", message: "Verifique os campos.", fieldErrors };
  }

  const requestHeaders = await headers();
  const result = await authenticateAdmin(
    { ...parsed.data, clientKey: clientKeyFromHeaders(requestHeaders) },
    {
      isAuthConfigured,
      isDatabaseConfigured,
      rateLimiter: loginRateLimiter,
      findAdminByEmail,
      verifyPassword,
      onSuccess: touchLastLogin,
    },
  );

  if (!result.ok) {
    return { status: "error", message: authFailureMessages[result.reason] };
  }

  await createAdminSession({
    adminId: result.admin.id,
    email: result.admin.email,
    name: result.admin.name,
    role: result.admin.role,
  });

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
