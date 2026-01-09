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
cp .env.example .env                # ajuste DATABASE_URL e todos os SUPABASE_*
npm install
npm run prisma:generate             # gera o client tipado
# Opcional: executar migrações com prisma migrate ou db push
npm run dev                         # inicia o servidor em modo watch
```

### Banco (Supabase/PostgreSQL)
O schema utiliza campos `geometry` e `uuid_generate_v4()`. Em qualquer ambiente novo execute:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";.
```

As migrations do Prisma assumem que essas extensões existem. Para desenvolvimento:

```bash
npm run prisma:migrate dev    # cria/atualiza o schema localmente (interativo)
```

Para deploy/CI use:

```bash
npm run prisma:generate
npx prisma migrate deploy     # aplica apenas migrations existentes
```

### Modelo de `.env`

```dotenv
# Runtime
NODE_ENV=development
PORT=8080
LOG_LEVEL=info
DEBUG_REQUEST_LOGS=false

# Banco de dados (exemplo Supabase com SSL obrigatório)
DATABASE_URL=...
# REDIS_URL=redis://localhost:6379/0

# Integrações externas
SICAR_API_BASE=https://www.car.gov.br/public/api
CORE_WORKFLOW_BIN=python server.py

# Supabase Auth
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=change-me-anon
SUPABASE_SERVICE_ROLE_KEY=change-me-service-role
SUPABASE_PASSWORD_RESET_REDIRECT=https://app.example.com/reset-password
SUPABASE_JWT_SECRET=change-me-jwt-secret
```

> Copie este conteúdo para `.env` e ajuste `DATABASE_URL` + todas as variáveis `SUPABASE_*` antes de iniciar a API. Defina `DEBUG_REQUEST_LOGS=true` apenas em ambientes de debug para registrar o JSON recebido com sucesso.

### Docker / Cloud Run
```bash
# Build e teste local
docker build -t canavision-api .
docker run --env-file .env -p 3333:3333 canavision-api

# Ciclo rápido (VM ou servidor dedicado)
docker stop canavision-api && docker rm canavision-api 2>/dev/null || true
docker build -t canavision-api:latest .
docker run -d --name canavision-api \
  --restart unless-stopped \
  --env-file /caminho/para/.env \
  -p 8080:8080 \
  canavision-api:latest
docker logs -f canavision-api

# Build no Cloud Build e deploy no Cloud Run
gcloud builds submit --tag gcr.io/<PROJECT_ID>/canavision-api .
gcloud run deploy canavision-api \
  --image gcr.io/<PROJECT_ID>/canavision-api \
  --region <REGION> \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=...,SUPABASE_URL=...,SUPABASE_ANON_KEY=...,SUPABASE_SERVICE_ROLE_KEY=...,SUPABASE_PASSWORD_RESET_REDIRECT=...,SUPABASE_JWT_SECRET=...,SICAR_API_BASE=...,CORE_WORKFLOW_BIN=..."
```

Em execução no Cloud Run, **não** force a variável `PORT`: o serviço já injeta `PORT=8080` automaticamente e o `env.PORT` da aplicação acompanhará o valor correto.

### Status atual (Nov/2025)
- Fluxo completo de autenticação usa **Supabase Auth** (registro, login, refresh e reset) — o backend apenas orquestra chamadas ao Supabase e sincroniza o usuário no Prisma (`usuarios`).
- Prisma conectado ao Postgres Supabase com migrations versionadas em `prisma/migrations`.
- Dockerfile compatível com Cloud Build/Cloud Run (instala dependências, roda `prisma generate` e `npm run build`).
- `.env.example` documenta todas as variáveis necessárias para desenvolvimento/produção.
