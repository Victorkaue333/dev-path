import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Imports não usados viram erro; variáveis prefixadas com "_" são toleradas.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // Server-only: evita importar o cliente Prisma gerado fora de src/server.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/generated/*"],
              message:
                "Importe o Prisma apenas em src/server/** (camada de acesso a dados). Veja docs/ARCHITECTURE.md.",
            },
          ],
        },
      ],
    },
  },
  {
    // A camada de servidor é a única que pode falar com o Prisma.
    files: ["src/server/**/*.ts", "prisma/**/*.ts"],
    rules: { "no-restricted-imports": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "src/generated/**",
    "scripts/**/*.cjs",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
