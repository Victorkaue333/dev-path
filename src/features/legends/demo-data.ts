import type { DemoRecord } from "@/features/content/demo-types";

export interface DemoLegend {
  slug: string;
  name: string;
  bornYear?: number;
  diedYear?: number;
  summary: string;
  biography: string;
  contributions: string[];
  /** Caminho em /public. PNGs oficiais fornecidos pelo mantenedor (docs/assets/README.md). */
  imagePath?: string;
}

/**
 * CONTEÚDO DEMONSTRATIVO — ver src/features/content/demo-types.ts
 * Textos curtos com fatos amplamente documentados; a biografia editorial completa é trabalho futuro.
 */
export const demoLegends: ReadonlyArray<DemoRecord<DemoLegend>> = [
  {
    slug: "ada-lovelace",
    imagePath: "/assets/characters/ada-lovelace.png",
    name: "Ada Lovelace",
    bornYear: 1815,
    diedYear: 1852,
    summary: "Matemática inglesa, autora das notas sobre a Máquina Analítica de Charles Babbage.",
    biography:
      "Augusta Ada King, condessa de Lovelace, traduziu e ampliou um artigo sobre a Máquina Analítica de Babbage em 1843. Em suas notas descreveu, passo a passo, como a máquina poderia calcular uma sequência de números de Bernoulli — texto frequentemente citado como o primeiro algoritmo publicado pensado para ser executado por uma máquina. Também antecipou que máquinas desse tipo poderiam manipular símbolos além de números.",
    contributions: [
      "Notas sobre a Máquina Analítica (1843)",
      "Descrição de um algoritmo para números de Bernoulli",
      "Visão de computação além do cálculo numérico",
    ],
    status: "PUBLISHED",
  },
  {
    slug: "alan-turing",
    imagePath: "/assets/characters/alan-turing.png",
    name: "Alan Turing",
    bornYear: 1912,
    diedYear: 1954,
    summary: "Matemático britânico, formalizou a noção de computação e ajudou a decifrar a Enigma.",
    biography:
      'Em 1936, no artigo "On Computable Numbers", Turing propôs um modelo abstrato de máquina — hoje chamado máquina de Turing — que define o que significa um problema ser computável. Durante a Segunda Guerra Mundial, em Bletchley Park, contribuiu decisivamente para a quebra das cifras da máquina alemã Enigma. Em 1950 publicou "Computing Machinery and Intelligence", origem do chamado teste de Turing.',
    contributions: [
      "Máquina de Turing e teoria da computabilidade (1936)",
      "Criptoanálise da Enigma em Bletchley Park",
      "Teste de Turing (1950)",
    ],
    status: "PUBLISHED",
  },
  {
    slug: "grace-hopper",
    imagePath: "/assets/characters/grace-hopper.png",
    name: "Grace Hopper",
    bornYear: 1906,
    diedYear: 1992,
    summary: "Cientista da computação e almirante da Marinha dos EUA, pioneira dos compiladores.",
    biography:
      "Grace Brewster Murray Hopper trabalhou no Harvard Mark I durante a guerra e, no início dos anos 1950, desenvolveu o A-0, um dos primeiros programas a traduzir instruções simbólicas em código de máquina. Defendeu linguagens próximas do inglês, o que levou ao FLOW-MATIC e influenciou diretamente o COBOL. Encerrou a carreira militar como contra-almirante.",
    contributions: [
      "Compilador A-0 (1952)",
      "FLOW-MATIC e influência no COBOL",
      "Popularização de linguagens de programação legíveis",
    ],
    status: "PUBLISHED",
  },
  {
    slug: "margaret-hamilton",
    imagePath: "/assets/characters/margaret-hamilton.png",
    name: "Margaret Hamilton",
    bornYear: 1936,
    summary: "Engenheira de software que liderou o software de voo do programa Apollo.",
    biography:
      'No Laboratório de Instrumentação do MIT, Margaret Hamilton dirigiu a equipe responsável pelo software de bordo das missões Apollo. O tratamento de prioridades e recuperação de erros desse software foi decisivo no pouso da Apollo 11. É uma das responsáveis por difundir o termo "engenharia de software". Recebeu a Medalha Presidencial da Liberdade em 2016.',
    contributions: [
      "Software de voo do programa Apollo",
      'Difusão do termo "engenharia de software"',
      "Medalha Presidencial da Liberdade (2016)",
    ],
    status: "PUBLISHED",
  },
  {
    slug: "tim-berners-lee",
    imagePath: "/assets/characters/tim-berners-lee.png",
    name: "Tim Berners-Lee",
    bornYear: 1955,
    summary: "Cientista da computação britânico, criador da World Wide Web.",
    biography:
      "Trabalhando no CERN, Tim Berners-Lee propôs em 1989 um sistema de hipertexto distribuído para compartilhar informação entre pesquisadores. Em 1990 implementou o primeiro servidor e o primeiro navegador web e definiu as bases que usamos até hoje: URL, HTTP e HTML. Em 1994 fundou o W3C (World Wide Web Consortium), que mantém os padrões abertos da web.",
    contributions: [
      "Proposta da World Wide Web no CERN (1989)",
      "Primeiro navegador e servidor web; URL, HTTP e HTML (1990)",
      "Fundação do W3C (1994)",
    ],
    status: "PUBLISHED",
  },
  {
    slug: "linus-torvalds",
    imagePath: "/assets/characters/linus-torvalds.webp",
    name: "Linus Torvalds",
    bornYear: 1969,
    summary: "Engenheiro de software finlandês, criador do kernel Linux e do Git.",
    biography:
      "Em 1991, ainda estudante na Universidade de Helsinque, Linus Torvalds anunciou um kernel de sistema operacional livre que viria a se chamar Linux, hoje base de servidores, Android e supercomputadores. Em 2005 criou o Git, sistema de controle de versão distribuído, para gerenciar o desenvolvimento do próprio kernel. Segue coordenando o desenvolvimento do Linux.",
    contributions: [
      "Kernel Linux (1991)",
      "Git, controle de versão distribuído (2005)",
      "Modelo de desenvolvimento aberto em larga escala",
    ],
    status: "PUBLISHED",
  },
];
