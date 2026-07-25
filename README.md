# Next.js Product

## Comecando

```bash
cp .env.example .env.local   # preencha NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev
```

| Script              | O que faz                                          |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                              |
| `npm run build`     | Build de producao com Webpack + export para `out/`  |
| `npm run lint`      | ESLint (`eslint-config-next`)                       |
| `npm run typecheck` | `next typegen` + `tsc --noEmit`                     |
| `npm test`          | Vitest (services, adapters, helpers)                |

## Estrutura

```txt
app/                 rotas e composicao de telas (pages finas)
  (public)/about/    route group publico
  (app)/dashboard/   route group da area logada
  examples/[id]/     rota dinamica com generateStaticParams
  status.json/       route handler estatico
components/
  ui/                primitives (Button, Input, Card, EmptyState, LoadingState, Badge)
  layout/            AppShell, Header, PageHeader
  <feature>/         telas e componentes de dominio
contexts/            AppProviders, QueryProvider, ToastContext
facades/<feature>/   keys.ts, queries.ts, mutations.ts, index.ts
services/
  api/               client.ts (fetch + envelope + ApiError), query.ts, errors.ts
  <feature>/         types.ts, adapters.ts, service.ts
hooks/               hooks publicos e utilitarios de UI
utils/               cn.ts, format.ts, routes.ts, <feature>Routes.ts
types/               tipos compartilhados entre features
tests/               testes de logica pura
```

## Fluxo de uma nova feature

```txt
app/<rota>/page.tsx  ->  components/<feature>/  ->  facades/<feature>/  ->  services/<feature>/
     (fina)                (UI + estados)            (React Query + cache)     (IO puro)
```
## Checklist de nova feature

1. Tipos em `services/<feature>/types.ts` (modelo da UI + DTO da API).
2. `adapters.ts` quando o DTO diferir do modelo.
3. `service.ts` com endpoint, metodo, body e query string.
4. `facades/<feature>/keys.ts` com a factory de query keys.
5. `queries.ts` e `mutations.ts` com hooks e invalidacoes.
6. Componentes em `components/<feature>/`.
7. Page fina em `app/<rota>/page.tsx`.
8. Route helpers em `utils/<feature>Routes.ts`.
9. Testes de service, adapters e helpers em `tests/`.
10. `npm run lint`, `npm test`, `npm run build`.

## Variaveis de ambiente

Copie `.env.example` para `.env.local`. Em export estatico nao existe runtime de servidor:
todo valor embutido no bundle e publico. Nunca coloque segredo em `NEXT_PUBLIC_*` nem token
em `localStorage`.

Sentry e opcional e vem desligado: as variaveis ja estao no `.env.example` e o passo a passo
esta em [docs/SENTRY.md](docs/SENTRY.md).

## Deploy no Heroku

O projeto usa `output: "export"`, entao o Heroku serve a pasta `out/` via `serve`.
Nao use fallback de SPA (`serve -s`), porque isso transforma rotas inexistentes em `/`.
Configure as variaveis do `.env.example` como config vars e consulte logs informando o app:

```bash
heroku config:set NEXT_PUBLIC_API_BASE_URL=https://api.example.com --app nome-do-app
heroku logs --tail --app nome-do-app
```
