# TODO - AtmosAgro API

## ✅ Concluído
- [x] Confirmar tecnologias (Node.js LTS, TypeScript, Express, Prisma, Postgres/Supabase).
- [x] Definir convenções de projeto (estrutura de pastas, lint, scripts de testes).
- [x] Modelar banco (schema Prisma + extensões PostGIS / uuid-ossp).
- [x] Elaborar contratos dos endpoints existentes (`docs/api/`).
- [x] Implementar Multitenancy (isolamento por `clienteId`) em Propriedades e Talhões.
- [x] Implementar Autenticação robusta (Cookies HTTP-Only + Supabase).
- [x] Criar integração com GCS para Signed URLs (Artefatos).

## 🚀 Próximos Passos (Pipeline de Imagens)
- [ ] Implementar endpoints de gestão do Pipeline (`POST /api/pipeline`, `GET /status`).
- [ ] Criar rotas internas de comunicação com Worker (`GET /internal/pipeline/next`).
- [ ] Desenvolver script de loop (Pull Model) no Core Python.
- [ ] Integrar callback de sucesso do Python com a tabela `Artefato`.
- [ ] Validar fluxo ponta a ponta (E2E) do Pipeline.

## ⏳ Médio/Longo Prazo
- [ ] Detalhar fluxo de ingestão SICAR (fontes, rate limits, armazenamento).
- [ ] Implementar sistema de Alertas e Notificações.
- [ ] Adicionar suporte a outros índices (NDWI, SAVI, EVI).
- [ ] Configurar Dashboard administrativo de Clientes.
- [ ] Definir estratégia de deploy e observabilidade mínima (logs, métricas, alertas).
