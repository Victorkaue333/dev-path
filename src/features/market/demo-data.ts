import type { TechnologyCategory } from "@/types/content";

export interface DemoTechnology {
  slug: string;
  name: string;
  category: TechnologyCategory;
  description?: string;
  website?: string;
}

/**
 * CONTEÚDO DEMONSTRATIVO — ver src/features/content/demo-types.ts
 * Tecnologias não têm estado de publicação: são um catálogo de apoio.
 * IMPORTANTE: não há aqui dados de mercado (salários, vagas, percentuais). Qualquer
 * estatística futura precisa citar fonte e data (docs/PRD.md, requisitos não funcionais).
 */
export const demoTechnologies: ReadonlyArray<DemoTechnology> = [
  {
    slug: "html",
    name: "HTML",
    category: "LANGUAGE",
    website: "https://developer.mozilla.org/pt-BR/docs/Web/HTML",
  },
  {
    slug: "css",
    name: "CSS",
    category: "LANGUAGE",
    website: "https://developer.mozilla.org/pt-BR/docs/Web/CSS",
  },
  {
    slug: "javascript",
    name: "JavaScript",
    category: "LANGUAGE",
    website: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript",
  },
  {
    slug: "typescript",
    name: "TypeScript",
    category: "LANGUAGE",
    website: "https://www.typescriptlang.org",
  },
  { slug: "python", name: "Python", category: "LANGUAGE", website: "https://www.python.org" },
  {
    slug: "sql",
    name: "SQL",
    category: "LANGUAGE",
    description: "Linguagem de consulta a bancos relacionais.",
  },
  { slug: "react", name: "React", category: "LIBRARY", website: "https://react.dev" },
  { slug: "nodejs", name: "Node.js", category: "PLATFORM", website: "https://nodejs.org" },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    category: "DATABASE",
    website: "https://www.postgresql.org",
  },
  { slug: "git", name: "Git", category: "TOOL", website: "https://git-scm.com" },
  { slug: "docker", name: "Docker", category: "TOOL", website: "https://www.docker.com" },
  { slug: "linux", name: "Linux", category: "PLATFORM", website: "https://www.kernel.org" },
];
