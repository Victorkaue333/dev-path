/** Link "pular para o conteúdo": visível apenas com foco de teclado. */
export function SkipLink({ targetId = "conteudo" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only z-50 rounded-md bg-dp-ink px-4 py-2 text-sm font-medium text-dp-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Pular para o conteúdo
    </a>
  );
}
