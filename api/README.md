# Nova API Atmos (skeleton)

Este diretório abriga o esqueleto inicial da API em Node.js + TypeScript usando Express. O foco atual é estruturar pastas e arquivos conforme o planejamento (`Tasks/Planejamento_API.md`), sem implementação de código.

## Estrutura principal
- `src/app.ts` – configuração do Express (middlewares, rotas).
- `src/server.ts` – bootstrap HTTP/Workers.
- `src/api/` – controladores, rotas e validadores por domínio.
- `src/services/` – regras de negócio/use cases.
- `src/repositories/` – camada de acesso a dados (Prisma/DB).
- `src/integrations/` – conectores externos (core Python, SICAR, storage).
- `src/workers/` – filas e processadores de jobs.
- `prisma/` – schema e migrations.

## Próximos passos
1. Definir dependências em `package.json` e instalar ferramentas (Express, Prisma, Zod etc.).
2. Implementar loaders (`src/app.ts`, `src/config/env.ts`), middlewares e rotas de exemplo.
3. Modelar o `schema.prisma` conforme o dicionário de dados.
4. Configurar Docker Compose (API + Postgres + Redis) e scripts de desenvolvimento.
