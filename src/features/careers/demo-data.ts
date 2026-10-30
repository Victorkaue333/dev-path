import type { DemoRecord } from "@/features/content/demo-types";
import type { AccentToken, SkillLevel } from "@/types/content";

export interface DemoCareer {
  slug: string;
  title: string;
  /** Nome curto para cartões compactos (hero). */
  shortTitle: string;
  /** Frase de impacto curta (hero). */
  tagline: string;
  shortDescription: string;
  description: string;
  icon: string;
  accent: AccentToken;
  order: number;
  /** Slugs de tecnologias (src/features/market/demo-data.ts) com grau de importância 1..3. */
  technologies: Array<{ slug: string; importance: 1 | 2 | 3 }>;
  entryLevel: SkillLevel;
}

/** CONTEÚDO DEMONSTRATIVO — ver src/features/content/demo-types.ts */
export const demoCareers: ReadonlyArray<DemoRecord<DemoCareer>> = [
  {
    slug: "desenvolvimento-front-end",
    title: "Desenvolvimento Front-end",
    shortTitle: "Frontend",
    tagline: "Interfaces que inspiram.",
    shortDescription: "Construa interfaces que as pessoas usam no navegador.",
    description:
      "Quem trabalha com front-end transforma design em páginas e aplicações interativas. O caminho começa em HTML, CSS e JavaScript, passa por acessibilidade e responsividade e chega a frameworks como React.",
    icon: "monitor",
    accent: "green",
    order: 1,
    entryLevel: "BEGINNER",
    technologies: [
      { slug: "html", importance: 1 },
      { slug: "css", importance: 1 },
      { slug: "javascript", importance: 1 },
      { slug: "typescript", importance: 2 },
      { slug: "react", importance: 2 },
      { slug: "git", importance: 1 },
    ],
    status: "PUBLISHED",
  },
  {
    slug: "desenvolvimento-back-end",
    title: "Desenvolvimento Back-end",
    shortTitle: "Backend",
    tagline: "A lógica por trás de tudo.",
    shortDescription: "Crie APIs, regras de negócio e integrações com bancos de dados.",
    description:
      "O back-end cuida do que acontece no servidor: autenticação, persistência, filas e integrações. Exige lógica de programação sólida, noções de redes/HTTP e modelagem de dados.",
    icon: "server",
    accent: "yellow",
    order: 2,
    entryLevel: "BEGINNER",
    technologies: [
      { slug: "javascript", importance: 1 },
      { slug: "nodejs", importance: 1 },
      { slug: "python", importance: 2 },
      { slug: "sql", importance: 1 },
      { slug: "postgresql", importance: 2 },
      { slug: "git", importance: 1 },
      { slug: "docker", importance: 3 },
    ],
    status: "PUBLISHED",
  },
  {
    slug: "desenvolvimento-full-stack",
    title: "Desenvolvimento Full Stack",
    shortTitle: "Full Stack",
    tagline: "Do zero ao projeto completo.",
    shortDescription: "Do navegador ao banco de dados: construa o produto inteiro.",
    description:
      "Full stack combina front-end e back-end: interface, API, persistência e deploy de uma mesma aplicação. É o caminho de quem quer entender o produto de ponta a ponta, geralmente depois de uma base sólida em uma das duas trilhas.",
    icon: "layers",
    accent: "green",
    order: 3,
    entryLevel: "INTERMEDIATE",
    technologies: [
      { slug: "javascript", importance: 1 },
      { slug: "typescript", importance: 1 },
      { slug: "react", importance: 1 },
      { slug: "nodejs", importance: 1 },
      { slug: "postgresql", importance: 2 },
      { slug: "git", importance: 1 },
      { slug: "docker", importance: 3 },
    ],
    status: "PUBLISHED",
  },
  {
    slug: "infraestrutura-e-devops",
    title: "Infraestrutura e DevOps",
    shortTitle: "DevOps",
    tagline: "Infraestrutura em ação.",
    shortDescription: "Mantenha sistemas rodando com automação, nuvem e observabilidade.",
    description:
      "Infra e DevOps conectam desenvolvimento e operação: Linux, redes, containers, CI/CD e nuvem. É uma trilha com forte componente prático e de automação.",
    icon: "cloud",
    accent: "coral",
    order: 4,
    entryLevel: "INTERMEDIATE",
    technologies: [
      { slug: "linux", importance: 1 },
      { slug: "docker", importance: 1 },
      { slug: "git", importance: 1 },
      { slug: "python", importance: 3 },
    ],
    status: "PUBLISHED",
  },
  {
    slug: "dados-e-analytics",
    title: "Dados e Analytics",
    shortTitle: "Dados",
    tagline: "Transforme dados em oportunidades.",
    shortDescription: "Transforme dados brutos em respostas para decisões.",
    description:
      "A área de dados vai de análise exploratória e visualização até engenharia de pipelines. Começa com planilhas e SQL, avança para Python e estatística aplicada.",
    icon: "bar-chart-3",
    accent: "yellow",
    order: 5,
    entryLevel: "BEGINNER",
    technologies: [
      { slug: "sql", importance: 1 },
      { slug: "python", importance: 1 },
      { slug: "postgresql", importance: 2 },
      { slug: "git", importance: 2 },
    ],
    status: "PUBLISHED",
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligência Artificial",
    shortTitle: "IA",
    tagline: "Construa com o futuro.",
    shortDescription: "Modelos, aplicações com IA e os fundamentos por trás deles.",
    description:
      "A trilha de IA parte de Python, estatística e álgebra linear, passa por aprendizado de máquina e chega a aplicações com modelos de linguagem. Exige base matemática e muita prática com dados.",
    icon: "brain",
    accent: "ink",
    order: 6,
    entryLevel: "INTERMEDIATE",
    technologies: [
      { slug: "python", importance: 1 },
      { slug: "sql", importance: 2 },
      { slug: "git", importance: 2 },
      { slug: "linux", importance: 3 },
    ],
    status: "PUBLISHED",
  },
  {
    slug: "seguranca-da-informacao",
    title: "Segurança da Informação",
    shortTitle: "Segurança",
    tagline: "Proteja o que importa.",
    shortDescription: "Rascunho em elaboração: trilha de segurança ainda não publicada.",
    description:
      "Segurança da informação cobre redes, sistemas, criptografia, análise de vulnerabilidades e resposta a incidentes. Conteúdo em curadoria.",
    icon: "shield",
    accent: "coral",
    order: 7,
    entryLevel: "INTERMEDIATE",
    technologies: [
      { slug: "linux", importance: 1 },
      { slug: "python", importance: 2 },
    ],
    // Rascunho proposital: demonstra que conteúdo não publicado não aparece no site.
    status: "DRAFT",
  },
];
