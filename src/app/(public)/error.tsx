"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { PaperCard } from "@/components/design-system/paper-card";
import { Button } from "@/components/ui/button";

/** Limite de erro das páginas públicas. Não expõe detalhes internos ao visitante. */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="dp-container dp-section flex justify-center">
      <PaperCard tilt="subtle" className="max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-dp-ink">Algo deu errado por aqui</h1>
        <p className="mt-2 text-dp-ink-soft">
          Não foi possível carregar esta página. Tente novamente; se persistir, o problema já foi
          registrado.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-xs text-dp-ink-soft/70">ref: {error.digest}</p>
        ) : null}
        <Button className="mt-6" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Tentar de novo
        </Button>
      </PaperCard>
    </div>
  );
}
