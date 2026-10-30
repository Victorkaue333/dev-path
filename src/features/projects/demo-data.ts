import type { DemoRecord } from "@/features/content/demo-types";
import type { SkillLevel } from "@/types/content";

export interface DemoProject {
  slug: string;
  title: string;
  description: string;
  level: SkillLevel;
  /** Omitido até existir estimativa editorial. */
  estimatedHours?: number;
  careerSlug?: string;
  technologySlugs: string[];
  /** Critérios de conclusão (Markdown simples). */
  acceptance: string;
}

/** CONTEÚDO DEMONSTRATIVO — ver src/features/content/demo-types.ts */
export const demoProjects: ReadonlyArray<DemoRecord<DemoProject>> = [
  {
    slug: "pagina-de-perfil-pessoal",
    title: "Página de perfil pessoal",
    description:
      "Uma página estática com foto, bio, lista de interesses e links. Primeiro contato com HTML semântico e CSS.",
    level: "BEGINNER",
    careerSlug: "desenvolvimento-front-end",
    technologySlugs: ["html", "css", "git"],
    acceptance:
      "- Usa `header`, `main` e `footer`.\n- Funciona em tela de celular e desktop.\n- Publicada em um serviço gratuito de hospedagem estática.",
    status: "PUBLISHED",
  },
  {
    slug: "lista-de-tarefas-no-navegador",
    title: "Lista de tarefas no navegador",
    description:
      "Adicionar, concluir e remover tarefas com JavaScript puro, salvando no localStorage.",
    level: "BEGINNER",
    careerSlug: "desenvolvimento-front-end",
    technologySlugs: ["html", "css", "javascript"],
    acceptance:
      "- Tarefas persistem ao recarregar a página.\n- Sem frameworks.\n- Navegável por teclado.",
    status: "PUBLISHED",
  },
  {
    slug: "api-de-tarefas-com-banco",
    title: "API de tarefas com banco de dados",
    description: "API REST com rotas de CRUD, validação de entrada e persistência em PostgreSQL.",
    level: "INTERMEDIATE",
    careerSlug: "desenvolvimento-back-end",
    technologySlugs: ["nodejs", "sql", "postgresql", "docker"],
    acceptance:
      "- Rotas documentadas (GET/POST/PUT/DELETE).\n- Erros retornam JSON padronizado.\n- Banco sobe com Docker Compose.",
    status: "PUBLISHED",
  },
  {
    slug: "analise-de-um-csv-publico",
    title: "Análise de um CSV público",
    description:
      "Carregar um conjunto de dados aberto, limpar, responder três perguntas e gerar gráficos.",
    level: "BEGINNER",
    careerSlug: "dados-e-analytics",
    technologySlugs: ["python", "sql"],
    acceptance:
      "- Fonte de dados citada.\n- Notebook ou script reproduzível.\n- Três gráficos com título e eixos nomeados.",
    status: "DRAFT",
  },
];
