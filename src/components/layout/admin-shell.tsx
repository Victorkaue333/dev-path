import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { adminNav } from "@/config/site";
import { logoutAction } from "@/features/admin/actions/login";
import type { AdminSession } from "@/server/auth/session-token";

import { MainNav } from "./main-nav";

interface AdminShellProps {
  session: AdminSession;
  children: ReactNode;
}

/**
 * Casca do painel: barra lateral escura, cabeçalho com identificação do administrador e logout.
 * Renderizada apenas após `requireAdminSession()` (src/app/admin/layout.tsx).
 */
export function AdminShell({ session, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-dp-paper">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo size="sm" onDark />
          <span className="ml-2 rounded bg-dp-green/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-dp-green uppercase">
            Admin
          </span>
        </div>
        <div className="p-3 [&_a]:text-dp-paper/80 [&_a:hover]:bg-sidebar-accent [&_a:hover]:text-dp-paper [&_a[aria-current=page]]:bg-sidebar-accent [&_a[aria-current=page]]:text-dp-green">
          <MainNav items={adminNav} orientation="vertical" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-dp-paper-line bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <p className="hidden items-center gap-1.5 text-sm text-dp-ink-soft sm:flex">
              <ShieldCheck className="size-4 text-dp-green-strong" aria-hidden="true" />
              <span>
                {session.name}{" "}
                <span className="text-dp-ink-soft/70">
                  ({session.role === "OWNER" ? "proprietário" : "editor"})
                </span>
              </span>
            </p>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut aria-hidden="true" />
                Sair
              </Button>
            </form>
          </div>
        </header>

        <nav
          aria-label="Seções do painel"
          className="border-b border-dp-paper-line bg-white px-4 py-2 lg:hidden"
        >
          <ul className="flex gap-2 overflow-x-auto text-sm">
            {adminNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-2 py-1 whitespace-nowrap hover:bg-dp-paper-strong"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main id="conteudo" className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
