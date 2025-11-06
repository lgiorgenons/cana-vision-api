# API em construção (Node.js)

Este diretório vai abrigar a nova API escrita em Node.js. O objetivo é expor o core (`canasat/`) por meio de endpoints REST/GraphQL, integrar dados de usuários da plataforma CanaVision, ingerir insights/alertas do banco e atender ao frontend. A implementação atual em FastAPI (`server.py`) permanece apenas como referência temporária.

Pré-requisitos planejados:
- Node.js LTS
- npm/yarn (a definir)
- Variáveis de ambiente para conectar ao core e ao banco (detalhes serão documentados conforme o desenvolvimento avançar)

Node.js API (in progress) that exposes the CanaVision core processing pipeline, integrates user metadata, and surfaces insights/alerts stored in the database. FastAPI remains as a temporary reference while the new service is implemented.

TODOs imediatos:
1. Definir estrutura do projeto (framework, organização de pastas, padrões de código).
2. Reimplementar rotas de workflow, consultas de status, ingestão de alertas e entrega de mapas/CSV.
3. Configurar autenticação/logging e integração com o banco de dados para leitura/escrita de informações dos usuários CanaVision.
