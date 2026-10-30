import { expect, test } from "@playwright/test";

test.describe("site público", () => {
  test("home carrega com título e navegação", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DevPath/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Seu caminho");
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  });

  test("navega para carreiras e abre o detalhe de uma carreira", async ({ page }) => {
    await page.goto("/carreiras");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Áreas para começar");
    await page.getByRole("link", { name: "Desenvolvimento Front-end" }).first().click();
    await expect(page).toHaveURL(/\/carreiras\/desenvolvimento-front-end$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Desenvolvimento Front-end",
    );
  });

  test("roadmap exibe etapas ordenadas", async ({ page }) => {
    await page.goto("/roadmaps/fundamentos-do-front-end");
    const steps = page.getByRole("list", { name: "Etapas do roadmap" }).locator("> li");
    await expect(steps).toHaveCount(5);
  });

  test("rota inexistente mostra a página 404 personalizada", async ({ page }) => {
    const response = await page.goto("/nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Esse caminho não existe");
  });

  test("robots bloqueia admin e api; sitemap existe", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    const text = await robots.text();
    expect(text).toContain("Disallow: /admin");
    expect(text).toContain("Disallow: /api/");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("/carreiras");
  });

  test("cabeçalhos de segurança presentes", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["x-powered-by"]).toBeUndefined();
  });
});

test.describe("painel administrativo", () => {
  test("/admin sem sessão redireciona para o login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Painel administrativo");
  });

  test("login é bloqueado sem AUTH_SECRET/DATABASE_URL e não indexável", async ({
    page,
    request,
  }) => {
    const response = await request.get("/admin/login");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");

    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill("admin@devpath.dev");
    await page.getByLabel("Senha").fill("senha-qualquer-123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /não configurad/i })).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
