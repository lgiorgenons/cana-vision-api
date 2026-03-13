# Avaliação Técnica — CanaVision API

> Gerado em: 2026-03-13 | Base: branch `main` (commit `470f3b9`)

---

## 1. Identificação do Sistema

**Nome:** CanaVision API (internamente "Atmos")
**Domínio:** Processamento e análise de imagens de satélite para monitoramento de lavouras de cana-de-açúcar
**Stack:** Node.js 20 + TypeScript + Express + Prisma + PostgreSQL (Supabase) + Redis + GCS
**Versão:** 0.1.0 — pré-produção
**Arquitetura:** REST API multi-tenant com pipeline assíncrono de processamento de imagens via BullMQ + worker Python

### Fluxo macro do produto
```
Frontend → API (Node.js) → Job Queue (BullMQ/Redis)
                               ↓
                         Worker (Python/Core)
                         [Sentinel-2 → GeoTIFF → índices NDVI/NDWI/...]
                               ↓
                         Google Cloud Storage
                               ↓
                         API registra Artefato → signed URL → Usuário
```

---

## 2. Estado Atual — O que está pronto

| Módulo | Status | Observação |
|---|---|---|
| Autenticação (Supabase + JWT + cookies) | ✅ 100% | Sólido, HTTP-only cookies, secure |
| CRUD Propriedades | ✅ 95% | Funcional com multi-tenancy |
| CRUD Talhões | ✅ 95% | Funcional com validação de propriedade |
| Artefatos (listagem + signed URLs) | ✅ 80% | GCS funcional |
| Schema do banco (PostGIS) | ✅ 100% | 13 modelos, indexes espaciais |
| Multi-tenancy (clienteId) | ⚠️ 70% | Lógica OK, mas cliente hardcoded |
| Pipeline / Jobs | ❌ 10% | Só estrutura, sem implementação |
| Alertas | ❌ 5% | Apenas skeleton |
| SICAR Integration | ❌ 5% | Apenas skeleton |
| Testes | ❌ 0% | Framework pronto, zero testes |
| Observabilidade | ⚠️ 40% | Pino logs, sem métricas/tracing |
| Produção-readiness | ⚠️ 40% | Faltam graceful shutdown, pooling, rate limit |

---

## 3. Análise de Segurança

### 3.1 Pontos positivos
- **HTTP-only cookies** para tokens JWT — protege contra XSS
- **SameSite=Strict + Secure** em produção — protege contra CSRF
- **Helmet.js** — headers de segurança padrão
- **CORS** configurável por env var
- **Zod** em todas as entradas — validação de esquema forte
- **Supabase JWT** validado em toda rota protegida
- **Status do usuário verificado** no middleware — usuários bloqueados são rejeitados
- **Queries Prisma** — type-safe, não há SQL concatenado

### 3.2 Vulnerabilidades e riscos

#### 🔴 Crítico

**SEC-01 — Client ID hardcoded em auth.service.ts**
```typescript
// src/services/auth/auth.service.ts:30
const DEFAULT_TEST_CLIENT_ID = '1a5845b7-3622-4eaa-9ed3-cec2b25f4aa7';
```
- **Risco:** Todos os usuários novos são criados no mesmo tenant de teste
- **Impacto:** Isolamento de dados completamente comprometido em produção
- **Correção:** Exigir `clienteId` no registro ou criar fluxo de onboarding de cliente

**SEC-02 — Bucket GCS hardcoded em imagens.service.ts**
```typescript
// src/services/imagens/imagens.service.ts:4
private bucketName = 'atmos-agro-data-lake-dev';
```
- **Risco:** Ignora a variável `GCS_BUCKET` do ambiente; todos acessam o mesmo bucket dev
- **Correção:** Usar `env.GCS_BUCKET`

#### 🟡 Alto

**SEC-03 — Ausência de rate limiting**
- Nenhum middleware de rate limit nas rotas públicas (`/auth/login`, `/auth/forgot-password`)
- **Risco:** Brute-force em credenciais, abuso de envio de e-mail
- **Correção:** `express-rate-limit` + Redis para janelas deslizantes

**SEC-04 — Sem trilha de auditoria ativa**
- Tabela `Auditoria` existe no schema mas nunca é escrita
- **Risco:** Sem rastreabilidade de quem fez o quê (requisito de compliance agrícola/LGPD)
- **Correção:** Middleware ou hooks Prisma para registrar mutações

**SEC-05 — SUPABASE_SERVICE_ROLE_KEY exposto no processo Node.js**
- A chave de serviço (admin ilimitado) é carregada via env e usada diretamente
- **Risco:** Leak de variáveis de ambiente compromete toda a instância Supabase
- **Melhoria:** Isolar chamadas com service role em módulo restrito; alertar no CI se a chave aparecer em logs

**SEC-06 — Validação de Content-Type pode ser bypassada**
- O middleware de validação verifica `Content-Type: application/json`, mas não há proteção contra payloads muito grandes além do limite de `2mb` do body parser
- **Correção:** Ajustar limites por rota (upload vs mutação padrão)

#### 🟠 Médio

**SEC-07 — Rota `/api/health` pública sem informação controlada**
- Atualmente retorna `{ status: 'ok' }`, mas pode ser expandida com informações de versão, dependências, etc.
- Verificar que nunca retorna stack traces ou dados internos

**SEC-08 — Sem validação de JWT expiration clock skew**
- Tokens com `exp` muito próximo do `now` podem ser aceitos em race conditions
- Supabase gerencia isso, mas vale verificar configuração de leeway

---

## 4. Análise de Performance

### 4.1 Pontos positivos
- **Arquitetura pull-based** no worker — sem push para o Python, o worker puxa o próximo job evitando race conditions
- **Signed URLs diretas do GCS** — downloads não passam pelo API, sem bottleneck
- **Cache de artefatos** — verifica artefatos existentes antes de criar novo job
- **PostGIS com índices GIST** — queries espaciais eficientes
- **Pino** — logger de altíssima performance (zero-overhead em produção)

### 4.2 Gargalos e riscos

#### 🔴 Crítico

**PERF-01 — Sem connection pooling configurado**
- Prisma em serverless/Cloud Run pode abrir muitas conexões ao PostgreSQL
- **Risco:** Esgotamento de conexões sob carga
- **Correção:** Configurar `connection_limit` no `DATABASE_URL` ou usar PgBouncer

```
# DATABASE_URL com pool limit
postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20
```

#### 🟡 Alto

**PERF-02 — N+1 queries potenciais**
- `findByIdWithTalhoes` em PropriedadeRepository faz include aninhado sem paginação
- **Risco:** Propriedades com centenas de talhões carregam tudo de uma vez
- **Correção:** Paginação em talhões ao buscar propriedade, ou endpoint separado

**PERF-03 — Signed URLs re-geradas a cada request**
- `imagens.service.ts` chama GCS para gerar signed URL em toda requisição (expiração de 15 min)
- **Risco:** Latência adicional de ~100-300ms por request em listagens com muitos artefatos
- **Correção:** Cache de signed URLs no Redis com TTL de 10 minutos

**PERF-04 — Sem compressão HTTP**
- Não há `compression` middleware no Express
- **Risco:** Respostas JSON grandes (listagens de artefatos geoespaciais) sem gzip
- **Correção:** `npm install compression` + middleware antes das rotas

#### 🟠 Médio

**PERF-05 — Redis opcional mas sem fallback gracioso**
- BullMQ depende de Redis; se Redis não estiver disponível, workers não iniciam mas API sobe normalmente
- **Risco:** Jobs criados na DB nunca são processados silenciosamente
- **Correção:** Health check de Redis na rota `/health`; falhar fast se Redis ausente e workers estiverem habilitados

**PERF-06 — Sem índices nas colunas mais consultadas**
- `clienteId` é filtrado em quase toda query mas não tem índice explícito além de FK
- `Job.status` filtrado em queries de worker sem índice
- **Correção:** Adicionar migrations com índices

```sql
CREATE INDEX idx_propriedade_clienteid ON "Propriedade"("clienteId");
CREATE INDEX idx_talhao_propriedadeid ON "Talhao"("propriedadeId");
CREATE INDEX idx_job_status ON "Job"("status");
CREATE INDEX idx_job_clienteid ON "Job"("clienteId");
CREATE INDEX idx_artefato_talhaoid ON "Artefato"("talhaoId");
```

---

## 5. Qualidade de Código e Arquitetura

### 5.1 Pontos positivos
- Separação clara em camadas (controller → service → repository)
- DTOs + Zod validators bem definidos
- Path aliases TypeScript organizados
- Dockerfile multi-stage eficiente
- Variáveis de ambiente validadas com Zod no boot

### 5.2 Débitos técnicos

**DT-01 — Zero testes**
- Framework Jest configurado mas nenhum teste implementado
- Sem cobertura de multi-tenancy, auth middleware, validators
- **Prioridade:** Alta — qualquer refatoração é cega

**DT-02 — Sem injeção de dependência**
- Services instanciam seus próprios repositories: `new PropriedadeRepository()`
- Dificulta mock em testes e substituição de implementações
- **Opção leve:** Passar repositories como parâmetro no construtor (sem container)

**DT-03 — Core Python Integration é TODO**
```typescript
// src/integrations/core/workflow.client.ts
// TODO: implementar integração com core Python
```
- Toda a proposta de valor do produto depende disso
- **Impacto:** Pipeline completo não funciona

**DT-04 — Inconsistência no tratamento de erros**
- Alguns controllers usam `next(error)`, outros `throw`
- `ApplicationError` precisa de padronização
- **Risco:** Alguns erros podem não ser capturados pelo error handler

**DT-05 — Falta OpenAPI/Swagger**
- Docs de endpoints em markdown (`/docs/api/`) mas sem spec automática
- **Risco:** Docs desatualizados, sem client SDK gerado automaticamente
- **Opção:** `zod-to-openapi` ou `@asteasolutions/zod-to-openapi`

---

## 6. Plano de Ação

### Priorização por impacto/risco

| ID | Título | Prioridade | Tipo | Esforço estimado |
|---|---|---|---|---|
| P-01 | Remover client ID hardcoded | 🔴 Crítico | Segurança | Pequeno |
| P-02 | Usar `env.GCS_BUCKET` no ImagensService | 🔴 Crítico | Segurança | Trivial |
| P-03 | Rate limiting nas rotas de auth | 🔴 Crítico | Segurança | Pequeno |
| P-04 | Connection pooling no DATABASE_URL | 🔴 Crítico | Performance | Trivial |
| P-05 | Implementar endpoints de Jobs (CRUD + worker) | 🔴 Crítico | Feature | Grande |
| P-06 | Escrever testes de integração (auth + multi-tenancy) | 🟡 Alto | Qualidade | Médio |
| P-07 | Ativar tabela Auditoria (middleware Prisma) | 🟡 Alto | Segurança | Médio |
| P-08 | Cache Redis para signed URLs | 🟡 Alto | Performance | Médio |
| P-09 | Adicionar índices de banco faltantes | 🟡 Alto | Performance | Pequeno |
| P-10 | Integração com Core Python (workflow.client.ts) | 🟡 Alto | Feature | Grande |
| P-11 | Compressão HTTP (gzip) | 🟠 Médio | Performance | Trivial |
| P-12 | Health check com dependências (DB, Redis, GCS) | 🟠 Médio | Operações | Pequeno |
| P-13 | Graceful shutdown | 🟠 Médio | Operações | Pequeno |
| P-14 | Geração de OpenAPI spec via zod-to-openapi | 🟠 Médio | DX | Médio |
| P-15 | Sistema de Alertas (detecção + notificação) | 🟠 Médio | Feature | Grande |
| P-16 | SICAR Integration | 🟡 Alto | Feature | Grande |
| P-17 | Injeção de dependência simples nos Services | 🟢 Baixo | Qualidade | Médio |
| P-18 | Dashboard de Clientes e Usuários | 🟢 Baixo | Feature | Grande |

---

## 7. Roadmap Sugerido

### Sprint 1 — Segurança e Estabilidade (semanas 1–2)
> Objetivo: tornar o sistema seguro para testes com clientes reais

- [ ] **P-01** Remover `DEFAULT_TEST_CLIENT_ID` — criar fluxo de onboarding de cliente
- [ ] **P-02** `imagens.service.ts` usar `env.GCS_BUCKET`
- [ ] **P-03** Rate limiting com `express-rate-limit` (login, forgot-password)
- [ ] **P-04** `DATABASE_URL` com `connection_limit` configurável
- [ ] **P-09** Migrations com índices de performance
- [ ] **P-11** Middleware `compression`
- [ ] **P-12** `/api/health` verificar DB + Redis + GCS

### Sprint 2 — Pipeline de Imagens (semanas 3–5)
> Objetivo: fazer o fluxo end-to-end de processamento funcionar

- [ ] **P-05** `POST /api/jobs` — criar job de processamento
- [ ] **P-05** `GET /api/jobs/:id` — status do job
- [ ] **P-05** `GET /internal/pipeline/next` — worker poll
- [ ] **P-05** `POST /internal/pipeline/:id/result` — worker callback
- [ ] **P-10** `workflow.client.ts` — integrar com Core Python
- [ ] **P-08** Cache Redis de signed URLs

### Sprint 3 — Qualidade e Observabilidade (semanas 6–7)
> Objetivo: base testada e monitorada

- [ ] **P-06** Testes de integração: auth, multi-tenancy, propriedades, talhões
- [ ] **P-07** Prisma middleware para tabela `Auditoria`
- [ ] **P-13** Graceful shutdown (SIGTERM handler)
- [ ] **P-14** OpenAPI spec gerada automaticamente dos schemas Zod

### Sprint 4 — Features de Negócio (semanas 8–10)
> Objetivo: funcionalidades avançadas

- [ ] **P-15** Sistema de Alertas — detecção de anomalias, severidade, notificação
- [ ] **P-16** SICAR Integration — consulta de CAR, boundaries ambientais
- [ ] **P-18** Gestão de Clientes e Usuários (admin)

---

## 8. Arquivos-chave para referência

| Arquivo | Propósito |
|---|---|
| `src/services/auth/auth.service.ts:30` | Client ID hardcoded — prioridade P-01 |
| `src/services/imagens/imagens.service.ts:4` | Bucket hardcoded — prioridade P-02 |
| `src/integrations/core/workflow.client.ts` | Core Python TODO — prioridade P-10 |
| `src/config/env.ts` | Validação de env vars |
| `src/middlewares/auth.middleware.ts` | JWT + cookie auth |
| `prisma/schema.prisma` | Schema completo com PostGIS |
| `docs/design/Macro_Visao_Ciclo_Vida_Imagens.md` | Arquitetura do pipeline |
| `endpoints_status.md` | Status de implementação de endpoints |

---

## 9. Decisões arquiteturais recomendadas

### 9.1 Multi-tenancy — Onboarding de Cliente
O fluxo atual registra usuários sem associação correta de cliente. Proposta:
1. Criar endpoint `POST /api/clientes` (admin)
2. No registro de usuário, exigir `codigoConvite` ou pré-cadastro do e-mail no cliente
3. Remover `DEFAULT_TEST_CLIENT_ID`

### 9.2 Pipeline — Worker Contract
Definir contrato formal entre API e worker Python:
```
GET /internal/pipeline/next
  → { jobId, talhaoGeometry, dateRange, indices, outputPath }

POST /internal/pipeline/:id/result
  → { status: 'succeeded' | 'failed', artefatos: [{tipo, formato, caminho}], erro? }
```

### 9.3 Observabilidade — Request Tracing
Adicionar `x-request-id` header em todas as respostas e propagar para logs:
```typescript
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] ?? crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});
```

### 9.4 Testes — Estratégia mínima viável
1. Testes de integração com banco real (Prisma + test DB)
2. Seed data por tenant para isolar testes
3. Focar em: auth middleware, multi-tenancy isolation, validators

---

*Documento gerado por análise estática do repositório. Revisar junto ao time antes de priorizar.*
