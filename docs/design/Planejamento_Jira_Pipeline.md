# Planejamento de Tarefas Jira - Pipeline de Imagens (AtmosAgro)

Este documento contém o detalhamento das entregas dividido por camadas de responsabilidade: Front-end (Camada de API e Interface) e Back-end (Core e Serviços).

---

## Task Principal: [ATMOS:0001] - Pipeline de Imagens: Implementação do Fluxo Independente

**Critérios de Aceite:**
*   **Condição 1:** Implementar fluxo de solicitação via API RESTful e acompanhamento de status.
*   **Condição 2:** Implementar lógica de processamento assíncrona desacoplada (Worker Python).
*   **Condição 3:** Garantir persistência de dados e integração segura com Google Cloud Storage.
*   **Condição 4:** Documentar contratos de entrada/saída (JSON) e validar isolamento de clientes.

---

## 🟢 Módulo: FRONT-END (Camada de API & UI)
*Foco: APIs RESTful, Componentes UI e Estados Globais.*

### Subtarefa 1.1: [ATMOS:0001.1] - Implementação de APIs RESTful e Contratos de Dados
**User Story:** Como desenvolvedor front-end, desejo endpoints claros e padronizados para solicitar jobs e consultar artefatos.
- **Entregáveis:**
    - `POST /api/jobs`: Endpoint de criação com validação Zod.
    - `GET /api/jobs/:id`: Retorno do estado atual do processamento.
    - `GET /api/jobs/:id/artifacts`: Endpoint para obtenção de Signed URLs.
- **Estado Global:** Gerenciamento do estado de polling (aguardando conclusão do job).

### Subtarefa 1.2: [ATMOS:0001.2] - Componentes UI de Monitoramento e Download
**User Story:** Como usuário, desejo visualizar o progresso do meu pedido e baixar o arquivo quando pronto.
- **Entregáveis:**
    - Componente de "Status de Processamento" (Progress Bar/Stepper).
    - Botão de "Download GeoTIFF" que consome a Signed URL.
    - Notificação de sucesso/erro no término do Job.

---

## 🔵 Módulo: BACK-END (Lógica & Integrações)
*Foco: Serviços de Dados, Lógica de Negócio e Integrações Externas.*

### Subtarefa 1.3: [ATMOS:0001.3] - Serviços de Dados e Orquestração (JobService)
**User Story:** Como sistema, desejo gerenciar a fila de processamento no banco de dados de forma resiliente.
- **Entregáveis:**
    - **JobService:** Lógica para buscar o próximo job pendente (Lógica FIFO).
    - **Internal API:** Endpoints `/api/internal/jobs/*` protegidos por `INTERNAL_API_KEY`.
    - **Data Integrity:** Garantir que o Job mude para `failed` se o Worker reportar erro.

### Subtarefa 1.4: [ATMOS:0001.4] - Integração Externa: Worker Python e GCS
**User Story:** Como motor de processamento, desejo consumir tarefas e persistir resultados no Cloud Storage.
- **Entregáveis:**
    - **CanaVision_core Integration:** Loop de consumo de tarefas via REST.
    - **GCS Integration:** Upload de GeoTIFFs para o bucket usando Service Account.
    - **Signed URL Logic:** Serviço de geração de URLs temporárias para download seguro.

---

## 📊 Métricas de Sucesso e Estimativa
- **Esforço Front-end:** 5 Story Points.
- **Esforço Back-end:** 8 Story Points.
- **Total:** 13 Story Points.
- **Métrica:** < 2 segundos para o usuário receber confirmação de Job criado; URLs de download válidas por 15 min.
