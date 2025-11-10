# Nova API Atmos (Express + Prisma)

Este diretório abriga a nova API em Node.js + TypeScript usando Express, Zod e Prisma. A estrutura segue o planejamento descrito em `Tasks/Planejamento_API.md`.

## Estrutura principal
- `src/app.ts` – configuração do Express (middlewares, rotas).
- `src/server.ts` – bootstrap HTTP/Workers.
- `src/api/` – controladores, rotas e validadores por domínio.
- `src/services/` – regras de negócio/use cases.
- `src/repositories/` – camada de acesso a dados (Prisma/DB).
- `src/integrations/` – conectores externos (core Python, SICAR, storage).
- `src/workers/` – filas e processadores de jobs.
- `prisma/` – schema (`schema.prisma`) e migrations/seed quando aplicável.

## Setup rápido
```bash
cd api
cp .env.example .env                # ajuste DATABASE_URL, JWT secrets etc.
npm install
npm run prisma:generate             # gera o client tipado
# Opcional: executar migrações com prisma migrate ou db push
npm run dev                         # inicia o servidor em modo watch
```

### Prisma + banco (Supabase/Postgres)
1. Garanta que o schema do banco foi criado (via `prisma migrate dev` ou aplicando o SQL equivalente no Supabase).
2. Atualize `DATABASE_URL` no `.env` com as credenciais do Supabase.
3. `npm run prisma:generate` para manter o client sincronizado quando o schema mudar.
4. Use `npm run prisma:migrate` para gerar/aplicar migrations (em ambientes locais) ou `prisma migrate deploy` em produção.

Com isso, o repositório `UsuariosRepository` já utiliza o Prisma Client para persistir usuários reais no Postgres.

### Modelo de `.env`

```dotenv
# Runtime
NODE_ENV=development
PORT=8080
LOG_LEVEL=info

# Banco de dados (exemplo Supabase com SSL obrigatório)
DATABASE_URL=...
# REDIS_URL=redis://localhost:6379/0

# Autenticação
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
RESET_TOKEN_EXPIRES_MINUTES=60

# Integrações externas
SICAR_API_BASE=https://www.car.gov.br/public/api
CORE_WORKFLOW_BIN=python server.py
```

> Copie este conteúdo para `.env` e ajuste `DATABASE_URL` e os segredos JWT antes de iniciar a API.
