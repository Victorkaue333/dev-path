"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavItem } from "@/config/site";

import { MainNav } from "./main-nav";

interface MobileNavProps {
  items: readonly NavItem[];
  cta?: NavItem;
}

/** Menu lateral para telas pequenas (Sheet do shadcn/ui), com a mesma navegação e CTA do cabeçalho. */
export function MobileNav({ items, cta }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Abrir menu" className="xl:hidden">
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-dp-paper">
        <SheetHeader>
          <SheetTitle>
            <Logo size="sm" asLink={false} />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-6">
          <MainNav items={items} orientation="vertical" onNavigate={() => setOpen(false)} />
          {cta ? (
            <Button
              asChild
              size="lg"
              className="rounded-full bg-dp-green text-dp-ink hover:bg-dp-green/90"
            >
              <Link href={cta.href} onClick={() => setOpen(false)}>
                {cta.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
