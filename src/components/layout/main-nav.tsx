"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/config/site";
import { cn } from "@/lib/utils";

interface MainNavProps {
  items: readonly NavItem[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
}

/**
 * Navegação com estado ativo por rota (item ativo ganha fundo suave e marcador verde).
 * Client Component mínimo (usa usePathname).
 */
export function MainNav({
  items,
  orientation = "horizontal",
  onNavigate,
  className,
}: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className={className}>
      <ul className={cn("flex gap-1", orientation === "vertical" ? "flex-col" : "items-center")}>
        {items.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "duration-fast relative inline-flex rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  "hover:bg-dp-paper-strong hover:text-dp-ink",
                  active
                    ? "bg-dp-paper-strong text-dp-ink after:absolute after:right-3 after:-bottom-0.5 after:left-3 after:h-1 after:-rotate-1 after:rounded-full after:bg-dp-green"
                    : "text-dp-ink-soft",
                  orientation === "vertical" && "w-full text-base",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
