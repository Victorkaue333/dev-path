import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/branding/logo";
import { PaperCard } from "@/components/design-system/paper-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isAuthConfigured, isDatabaseConfigured } from "@/config/env";
import { LoginForm } from "@/features/admin/components/login-form";

/**
 * Login exclusivo de administradores. Sem cadastro público.
 * Quando o ambiente não tem AUTH_SECRET ou DATABASE_URL, o formulário fica bloqueado
 * com explicação — nunca há bypass.
 */
export default function AdminLoginPage() {
  const blocked = !isAuthConfigured || !isDatabaseConfigured;

  return (
    <main className="dp-container flex flex-1 flex-col items-center justify-center py-12">
      <Logo size="md" onDark />
      <PaperCard tilt="subtle" textured className="mt-8 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-dp-ink">Painel administrativo</h1>
        <p className="mt-1 text-sm text-dp-ink-soft">
          Acesso restrito à equipe editorial do DevPath.
        </p>

        {blocked ? (
          <Alert className="mt-6" role="status">
            <AlertTriangle aria-hidden="true" />
            <AlertTitle>Login indisponível neste ambiente</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-1 pl-4">
                {!isAuthConfigured ? <li>AUTH_SECRET não configurado.</li> : null}
                {!isDatabaseConfigured ? (
                  <li>
                    DATABASE_URL não configurada (nenhum administrador pode existir sem banco).
                  </li>
                ) : null}
              </ul>
              <p className="mt-2">
                Pré-requisitos em docs/ENVIRONMENT.md e docs/Security-Guide.md.
              </p>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-dp-ink-soft">
          <Link href="/" className="underline underline-offset-2 hover:text-dp-ink">
            Voltar ao site
          </Link>
        </p>
      </PaperCard>
    </main>
  );
}
