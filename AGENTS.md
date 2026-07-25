<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Arquitetura deste repo

Camadas: `app/` (rotas finas) -> `components/` (UI) -> `facades/` (React Query + cache) -> `services/` (IO puro).

- Componente nunca importa `services/*` direto: use a facade da feature.
- Service nao importa React, nao mostra toast e nao redireciona.
- Query keys e invalidacoes so em `facades/<feature>/keys.ts`.
- URLs com parametro vem de `utils/<feature>Routes.ts`.
- O projeto usa `output: "export"`: sem Server Actions, ISR, cookies em Server Component ou route handler dinamico.

Detalhes e checklists em [README.md](README.md) e [NEXTJS_TEMPLATE_SPEC.md](NEXTJS_TEMPLATE_SPEC.md).
