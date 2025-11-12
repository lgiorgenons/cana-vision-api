# Docker & Deploy

Este diretório guarda anotações para empacotar a API em contêiner e enviá-la ao Cloud Run.

## Build local

```bash
cd api
docker build -t canavision-api .
docker run --env-file .env -p 3333:3333 canavision-api
```

## Cloud Build + Cloud Run

```bash
cd api
gcloud builds submit --tag gcr.io/<PROJECT_ID>/canavision-api .

gcloud run deploy canavision-api \
  --image gcr.io/<PROJECT_ID>/canavision-api \
  --region <REGION> \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=...,SUPABASE_URL=...,SUPABASE_ANON_KEY=...,SUPABASE_SERVICE_ROLE_KEY=...,SUPABASE_PASSWORD_RESET_REDIRECT=...,SUPABASE_JWT_SECRET=...,SICAR_API_BASE=...,CORE_WORKFLOW_BIN=..."
```

> Não defina manualmente `PORT` no Cloud Run — o serviço injeta o valor automaticamente e nossa aplicação lê `env.PORT`.

Use este espaço para armazenar `docker-compose.override.yml`, manifestos extras ou scripts de deploy quando forem necessários.
