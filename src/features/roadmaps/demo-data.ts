import type { DemoRecord } from "@/features/content/demo-types";
import type { SkillLevel } from "@/types/content";

export interface DemoTopic {
  slug: string;
  title: string;
  description?: string;
}

export interface DemoRoadmapStep {
  order: number;
  title: string;
  description: string;
  topics: DemoTopic[];
}

export interface DemoRoadmap {
  slug: string;
  title: string;
  description: string;
  level: SkillLevel;
  order: number;
  careerSlug: string;
  steps: DemoRoadmapStep[];
}

/** CONTEÚDO DEMONSTRATIVO — ver src/features/content/demo-types.ts */
export const demoRoadmaps: ReadonlyArray<DemoRecord<DemoRoadmap>> = [
  {
    slug: "fundamentos-do-front-end",
    title: "Fundamentos do Front-end",
    description:
      "Do primeiro arquivo HTML até uma aplicação React simples publicada. Pensado para quem nunca programou.",
    level: "BEGINNER",
    order: 1,
    careerSlug: "desenvolvimento-front-end",
    status: "PUBLISHED",
    steps: [
      {
        order: 1,
        title: "Como a web funciona",
        description: "Navegador, servidor, HTTP e o que acontece quando você digita uma URL.",
        topics: [
          { slug: "http-basico", title: "HTTP básico" },
          { slug: "navegador-e-devtools", title: "Navegador e DevTools" },
        ],
      },
      {
        order: 2,
        title: "HTML semântico",
        description: "Estrutura de documentos, formulários e acessibilidade desde o início.",
        topics: [
          { slug: "html-semantico", title: "HTML semântico" },
          { slug: "acessibilidade-basica", title: "Acessibilidade básica" },
        ],
      },
      {
        order: 3,
        title: "CSS e layout responsivo",
        description: "Box model, Flexbox, Grid e design que funciona em qualquer tela.",
        topics: [
          { slug: "css-fundamentos", title: "Fundamentos de CSS" },
          { slug: "flexbox-e-grid", title: "Flexbox e Grid" },
          { slug: "responsividade", title: "Responsividade" },
        ],
      },
      {
        order: 4,
        title: "JavaScript essencial",
        description: "Variáveis, funções, arrays, DOM e eventos — a base de tudo que vem depois.",
        topics: [
          { slug: "javascript-fundamentos", title: "Fundamentos de JavaScript" },
          { slug: "dom-e-eventos", title: "DOM e eventos" },
        ],
      },
      {
        order: 5,
        title: "Git e primeiro deploy",
        description: "Versionamento com Git, GitHub e publicação de um site estático.",
        topics: [
          { slug: "git-basico", title: "Git básico" },
          { slug: "deploy-estatico", title: "Deploy de site estático" },
        ],
      },
    ],
  },
  {
    slug: "fundamentos-do-back-end",
    title: "Fundamentos do Back-end",
    description:
      "Lógica de programação, HTTP, bancos relacionais e uma API REST simples com persistência.",
    level: "BEGINNER",
    order: 1,
    careerSlug: "desenvolvimento-back-end",
    status: "PUBLISHED",
    steps: [
      {
        order: 1,
        title: "Lógica e uma linguagem",
        description:
          "Escolha JavaScript (Node.js) ou Python e domine estruturas de controle e funções.",
        topics: [
          { slug: "javascript-fundamentos", title: "Fundamentos de JavaScript" },
          { slug: "python-fundamentos", title: "Fundamentos de Python" },
        ],
      },
      {
        order: 2,
        title: "HTTP e APIs",
        description: "Métodos, status codes, JSON e o desenho de uma API REST.",
        topics: [
          { slug: "http-basico", title: "HTTP básico" },
          { slug: "rest-apis", title: "APIs REST" },
        ],
      },
      {
        order: 3,
        title: "Bancos de dados relacionais",
        description: "Modelagem, SQL e PostgreSQL na prática.",
        topics: [
          { slug: "sql-fundamentos", title: "Fundamentos de SQL" },
          { slug: "postgresql-basico", title: "PostgreSQL básico" },
        ],
      },
      {
        order: 4,
        title: "Versionamento e ambiente",
        description: "Git, variáveis de ambiente e um primeiro contato com containers.",
        topics: [
          { slug: "git-basico", title: "Git básico" },
          { slug: "docker-basico", title: "Docker básico" },
        ],
      },
    ],
  },
  {
    slug: "analise-de-dados-com-sql-e-python",
    title: "Análise de dados com SQL e Python",
    description: "Rascunho em elaboração: trilha de dados ainda não publicada.",
    level: "BEGINNER",
    order: 1,
    careerSlug: "dados-e-analytics",
    status: "DRAFT",
    steps: [
      {
        order: 1,
        title: "SQL para análise",
        description: "Consultas, agregações e junções.",
        topics: [{ slug: "sql-fundamentos", title: "Fundamentos de SQL" }],
      },
    ],
  },
];
