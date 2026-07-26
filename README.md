# Next.js Product

Aplicacao web para consumir a API de produtos, com login/cadastro, dashboard de
produtos, logs de requisicao e teste de integracao com Sentry.

## Aplicacao publica

https://product-next-app-f9bac17e3cb3.herokuapp.com/

## Comecando

```bash
cp .env.example .env.local   # preencha as variaveis NEXT_PUBLIC_*
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

## Funcionalidades

- Login e cadastro de usuario na tela inicial.
- Dashboard autenticado com sessao em memoria.
- Listagem, cadastro, edicao e exclusao de produtos.
- Listagem paginada de logs em `/logs`.
- Listagem paginada de logs de erro em `/logs/errors`.
- Tela `/sentry-test/` para validar `NEXT_PUBLIC_SENTRY_DSN` e disparo de evento.
- `status.json` gerado estaticamente para verificacao simples de deploy.

## Estrutura

```txt
app/                    rotas e composicao de telas (pages finas)
  page.tsx              login/cadastro
  dashboard/page.tsx    area logada
  sentry-test/page.tsx  diagnostico do Sentry
  status.json/          route handler estatico
components/
  ui/                   primitives (Button, Input, Dialog, DropdownMenu, Badge)
  auth/                 tela de autenticacao
  dashboard/            dashboard, produtos e logs
  diagnostics/          Sentry DSN e teste de evento
  layout/               AppShell, Header, PageHeader
contexts/               AppProviders, QueryProvider, AuthContext, ToastContext
facades/<feature>/      keys.ts, queries.ts, mutations.ts, index.ts
services/
  api/                  client.ts (fetch + envelope/raw + ApiError), errors.ts
  auth/                 login e cadastro
  products/             CRUD de produtos
  logs/                 listagem paginada de logs
hooks/                  hooks publicos e utilitarios de UI
utils/                  cn.ts, format.ts, routes.ts, <feature>Routes.ts
docs/openapi/           OpenAPI e Postman collection da API
tests/                  testes de logica pura
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

Variaveis usadas:

- `NEXT_PUBLIC_API_BASE_URL`: URL base da API PHP.
- `NEXT_PUBLIC_SITE_URL`: URL publica deste frontend.
- `NEXT_PUBLIC_SENTRY_DSN`: DSN publico do Sentry, opcional.
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT`: ambiente do Sentry, por exemplo `production`.
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`: taxa de traces do Sentry.

Sentry e opcional e vem desligado: as variaveis ja estao no `.env.example` e o passo a passo
esta em [docs/SENTRY.md](docs/SENTRY.md).

## Documentacao da API

Os contratos da API estao em:

- [docs/openapi/openapi.yaml](docs/openapi/openapi.yaml)
- [docs/openapi/product_php_api.postman_collection.json](docs/openapi/product_php_api.postman_collection.json)

## Deploy no Heroku

Aplicacao publica:

https://product-next-app-f9bac17e3cb3.herokuapp.com/

O projeto usa `output: "export"`, entao o Heroku serve a pasta `out/` via `serve`.
Nao use fallback de SPA (`serve -s`), porque isso transforma rotas inexistentes em `/`.
Configure as variaveis do `.env.example` como config vars e consulte logs informando o app:

```bash
heroku config:set NEXT_PUBLIC_API_BASE_URL=https://api.example.com --app nome-do-app
heroku logs --tail --app nome-do-app
```

## GitHub Actions

O workflow [Build](.github/workflows/build.yml) gera um `.env` a partir das
repository secrets antes de rodar lint, testes e build. Cadastre as mesmas
variaveis `NEXT_PUBLIC_*` do `.env.example` nas secrets do repositorio.
