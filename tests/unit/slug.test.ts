import { describe, expect, it } from "vitest";

import { findDuplicateSlugs, isValidSlug, slugify } from "@/lib/slug";

describe("slugify", () => {
  it("remove acentos, espaços e caracteres especiais", () => {
    expect(slugify("Desenvolvimento Front-end")).toBe("desenvolvimento-front-end");
    expect(slugify("Análise de dados: SQL & Python!")).toBe("analise-de-dados-sql-python");
    expect(slugify("  Lendas   da TI ")).toBe("lendas-da-ti");
  });

  it("colapsa hífens repetidos e remove das pontas", () => {
    expect(slugify("--a---b--")).toBe("a-b");
  });
});

describe("isValidSlug", () => {
  it("aceita apenas minúsculas, dígitos e hífens simples", () => {
    expect(isValidSlug("ada-lovelace")).toBe(true);
    expect(isValidSlug("Ada-Lovelace")).toBe(false);
    expect(isValidSlug("ada--lovelace")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("-ada")).toBe(false);
  });
});

describe("findDuplicateSlugs", () => {
  it("retorna slugs repetidos uma única vez", () => {
    expect(
      findDuplicateSlugs([{ slug: "a" }, { slug: "b" }, { slug: "a" }, { slug: "a" }]),
    ).toEqual(["a"]);
    expect(findDuplicateSlugs([{ slug: "x" }])).toEqual([]);
  });
});
