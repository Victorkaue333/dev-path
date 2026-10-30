import type { Metadata } from "next";
import { type ReactNode, Suspense } from "react";

import { AdminShell } from "@/components/layout/admin-shell";
import { SkipLink } from "@/components/layout/skip-link";
import { Skeleton } from "@/components/ui/skeleton";
import { adminMetadata } from "@/lib/seo";
import { requireAdminSession } from "@/server/auth/require-admin";

export const metadata: Metadata = adminMetadata;

/**
 * Layout do painel. A verificação de sessão lê cookies, então roda dentro de <Suspense>
 * (exigência do Cache Components). Sem sessão válida, `requireAdminSession` redireciona.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <SkipLink />
      <Suspense fallback={<AdminShellSkeleton />}>
        <AdminGate>{children}</AdminGate>
      </Suspense>
    </>
  );
}

async function AdminGate({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();
  return <AdminShell session={session}>{children}</AdminShell>;
}

function AdminShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-dp-paper" aria-busy="true" aria-label="Verificando sessão">
      <div className="hidden w-64 bg-sidebar lg:block" />
      <div className="flex-1 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    </div>
  );
}
