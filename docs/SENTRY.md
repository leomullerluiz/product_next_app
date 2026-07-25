# Sentry (opcional)

O template ja deixa as variaveis prontas em `.env.example`; o pacote nao vem instalado para
nao pesar projetos que nao usam observabilidade.

```bash
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0
```

Com o DSN vazio nada e enviado, entao a aplicacao roda normalmente sem configuracao.

## Testando o DSN

A rota `/sentry-test/` mostra se `NEXT_PUBLIC_SENTRY_DSN` foi embutido no build,
valida o formato basico da DSN, compara o valor renderizado com o valor presente no
client bundle e envia um erro client-side de exemplo.

## Habilitando

1. Instale o SDK:

   ```bash
   npm install @sentry/nextjs
   ```

2. Preencha `NEXT_PUBLIC_SENTRY_DSN` no `.env.local`.

3. Crie `instrumentation-client.ts` na raiz do projeto:

   ```ts
   import * as Sentry from "@sentry/nextjs";

   const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

   if (dsn) {
     Sentry.init({
       dsn,
       environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
       tracesSampleRate: Number(
         process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0,
       ),
     });
   }
   ```

4. Reporte os erros de boundary em `app/error.tsx` e `app/global-error.tsx`, no lugar do
   `console.error` atual:

   ```ts
   Sentry.captureException(error);
   ```

## Notas para export estatico

- Com `output: "export"` so existe o SDK de browser: nao ha API route, tunnel route
  nem source maps enviados por um runtime Node em producao.
- O upload de source maps roda no build (CI), com `SENTRY_AUTH_TOKEN` como segredo do
  pipeline — nunca como `NEXT_PUBLIC_*`.
- Antes de configurar o plugin de build, confira a compatibilidade do `@sentry/nextjs` com a
  versao do Next instalada aqui e com `next build --webpack`.
