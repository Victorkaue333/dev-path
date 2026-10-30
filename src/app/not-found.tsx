import { Compass } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/branding/logo";
import { Doodle } from "@/components/design-system/doodle";
import { PaperCard } from "@/components/design-system/paper-card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="dp-container flex min-h-screen flex-col items-center justify-center py-16 text-center">
      <Logo size="md" />
      <PaperCard tilt="subtle" textured className="mt-10 max-w-lg p-10">
        <Doodle kind="crown" className="mx-auto mb-4 h-10 text-dp-yellow" />
        <p className="font-marker text-6xl text-dp-coral">404</p>
        <h1 className="mt-2 text-2xl font-bold text-dp-ink">Esse caminho não existe</h1>
        <p className="mt-3 text-dp-ink-soft">
          A página pode ter sido movida ou o endereço está incorreto. Volte para a trilha principal.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <Compass aria-hidden="true" />
              Ir para o início
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/carreiras">Ver carreiras</Link>
          </Button>
        </div>
      </PaperCard>
    </main>
  );
}
