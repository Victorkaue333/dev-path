import type { PublicationStatus } from "@/types/content";

/**
 * CONTEÚDO DEMONSTRATIVO
 * ----------------------
 * Os arquivos `src/features/*\/demo-data.ts` são a ÚNICA fonte do conteúdo de demonstração.
 * Eles alimentam (a) o site em modo `CONTENT_SOURCE=demo` e (b) o seed `prisma/seed.ts`.
 * Quando o banco estiver em uso, o conteúdo real vive no PostgreSQL e estes arquivos
 * passam a servir apenas para desenvolvimento local e testes (docs/DATABASE.md, seção Transição).
 */
export type DemoRecord<T> = T & {
  /** Permite exercitar o filtro de publicação sem banco. */
  status: PublicationStatus;
};
