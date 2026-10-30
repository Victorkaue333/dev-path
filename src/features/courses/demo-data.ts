import type { DemoRecord } from "@/features/content/demo-types";
import type { SkillLevel } from "@/types/content";

export interface DemoCourse {
  slug: string;
  title: string;
  description: string;
  provider: string;
  url: string;
  language: string;
  level: SkillLevel;
  isFree: boolean;
  isOfficialDocs: boolean;
  /** Omitido quando não há duração oficial declarada pelo provedor. */
  durationMinutes?: number;
  topicSlugs: string[];
}

/**
 * CONTEÚDO DEMONSTRATIVO — ver src/features/content/demo-types.ts
 * Apenas recursos gratuitos e links públicos de documentação/plataformas conhecidas.
 * A curadoria editorial definitiva (descrições, níveis, relação com tópicos) é trabalho futuro.
 */
export const demoCourses: ReadonlyArray<DemoRecord<DemoCourse>> = [
  {
    slug: "mdn-aprenda-desenvolvimento-web",
    title: "Aprenda desenvolvimento web (MDN)",
    description: "Guias introdutórios de HTML, CSS e JavaScript mantidos pela Mozilla.",
    provider: "MDN Web Docs",
    url: "https://developer.mozilla.org/pt-BR/docs/Learn_web_development",
    language: "pt-BR",
    level: "BEGINNER",
    isFree: true,
    isOfficialDocs: true,
    topicSlugs: ["html-semantico", "css-fundamentos", "javascript-fundamentos", "dom-e-eventos"],
    status: "PUBLISHED",
  },
  {
    slug: "react-dev-aprenda-react",
    title: "Aprenda React (documentação oficial)",
    description: "Tutorial e guias oficiais do React, com versão em português.",
    provider: "react.dev",
    url: "https://pt-br.react.dev/learn",
    language: "pt-BR",
    level: "INTERMEDIATE",
    isFree: true,
    isOfficialDocs: true,
    topicSlugs: ["javascript-fundamentos", "dom-e-eventos"],
    status: "PUBLISHED",
  },
  {
    slug: "python-tutorial-oficial",
    title: "Tutorial oficial do Python",
    description: "O tutorial da documentação oficial do Python 3, traduzido para português.",
    provider: "Python Software Foundation",
    url: "https://docs.python.org/pt-br/3/tutorial/",
    language: "pt-BR",
    level: "BEGINNER",
    isFree: true,
    isOfficialDocs: true,
    topicSlugs: ["python-fundamentos"],
    status: "PUBLISHED",
  },
  {
    slug: "pro-git-livro",
    title: "Pro Git (livro gratuito)",
    description: "Livro oficial do projeto Git, disponível online em português.",
    provider: "git-scm.com",
    url: "https://git-scm.com/book/pt-br/v2",
    language: "pt-BR",
    level: "BEGINNER",
    isFree: true,
    isOfficialDocs: true,
    topicSlugs: ["git-basico"],
    status: "PUBLISHED",
  },
  {
    slug: "postgresql-tutorial-oficial",
    title: "Tutorial oficial do PostgreSQL",
    description: "Parte introdutória da documentação do PostgreSQL (em inglês).",
    provider: "PostgreSQL Global Development Group",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
    language: "en",
    level: "BEGINNER",
    isFree: true,
    isOfficialDocs: true,
    topicSlugs: ["sql-fundamentos", "postgresql-basico"],
    status: "PUBLISHED",
  },
  {
    slug: "typescript-handbook",
    title: "TypeScript Handbook",
    description: "Manual oficial do TypeScript (em inglês).",
    provider: "typescriptlang.org",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    language: "en",
    level: "INTERMEDIATE",
    isFree: true,
    isOfficialDocs: true,
    topicSlugs: ["javascript-fundamentos"],
    status: "PUBLISHED",
  },
  {
    slug: "freecodecamp-portugues",
    title: "freeCodeCamp em português",
    description: "Currículo gratuito e interativo de desenvolvimento web.",
    provider: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn/",
    language: "pt-BR",
    level: "BEGINNER",
    isFree: true,
    isOfficialDocs: false,
    topicSlugs: ["html-semantico", "css-fundamentos", "javascript-fundamentos"],
    status: "PUBLISHED",
  },
  {
    slug: "docker-get-started",
    title: "Docker — Get started",
    description: "Guia oficial de introdução ao Docker (em inglês). Rascunho: ainda em curadoria.",
    provider: "docs.docker.com",
    url: "https://docs.docker.com/get-started/",
    language: "en",
    level: "INTERMEDIATE",
    isFree: true,
    isOfficialDocs: true,
    topicSlugs: ["docker-basico"],
    status: "DRAFT",
  },
];
