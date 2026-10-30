// Configuração do Prisma 7. A URL do banco vive aqui (não mais no schema).
// `dotenv/config` carrega `.env` para a CLI (migrate, studio, seed).
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Em `prisma generate` a URL não é necessária; em migrate/db ela é obrigatória.
    url: process.env["DATABASE_URL"],
  },
});
