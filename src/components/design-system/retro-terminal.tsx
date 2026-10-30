import { cn } from "@/lib/utils";

export interface RetroTerminalProps {
  title?: string;
  /** Linhas exibidas; prefixo `$`/`>` é visual. */
  lines: readonly string[];
  className?: string;
}

/**
 * Janela de terminal retrô (fundo escuro, texto verde, fonte mono).
 * Contrato: conteúdo textual real (lido por leitores de tela), decoração apenas na moldura.
 */
export function RetroTerminal({ title = "devpath", lines, className }: RetroTerminalProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-black/40 bg-dp-ink text-dp-green shadow-paper-lift",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-3 py-2">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-dp-coral" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-dp-yellow" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-dp-green" />
        <span className="ml-2 font-mono text-xs text-dp-paper/60">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <code>
          {lines.map((line, index) => (
            <span key={`${index}-${line}`} className="block">
              <span aria-hidden="true" className="text-dp-paper/50">
                {index === 0 ? "$ " : "> "}
              </span>
              {line}
            </span>
          ))}
          <span
            aria-hidden="true"
            className="inline-block h-4 w-2 animate-pulse bg-dp-green align-middle"
          />
        </code>
      </pre>
    </div>
  );
}
