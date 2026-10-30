## O que muda

## Por quê

## Como testar

```bash
pnpm install
pnpm check
```

## Checklist

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam localmente
- [ ] Sem segredos, tokens ou URLs privadas no diff
- [ ] Nenhum acesso ao Prisma fora de `src/server/**`
- [ ] Leituras de cookies/banco em Server Components estão dentro de `<Suspense>`
- [ ] Documentação atualizada (`docs/` e `CHANGELOG.md`), com status Implementado/Planejado/Pendente correto
- [ ] Decisão arquitetural registrada em `docs/DECISIONS.md` (se aplicável)
