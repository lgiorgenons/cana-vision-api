# TODO inicial – Nova API Atmos

- [x] Confirmar tecnologias (Node.js LTS, TypeScript, Express, Prisma, Postgres/Supabase).
- [x] Definir convenções de projeto (estrutura de pastas, lint, scripts de testes).
- [x] Modelar banco (schema Prisma + extensões PostGIS / uuid-ossp).
- [x] Elaborar contratos dos endpoints existentes (`docs/endpoints.md`).
- [ ] Mapear integração com o core Python (WorkflowService vs CLI wrappers).
- [ ] Levantar requisitos completos de autenticação/autorização e RBAC.
- [ ] Detalhar fluxo de ingestão SICAR (fontes, rate limits, armazenamento).
- [ ] Planejar storage de artefatos (filesystem + S3 compatível) e versionamento.
- [ ] Definir estratégia de deploy e observabilidade mínima (logs, métricas, alertas).
