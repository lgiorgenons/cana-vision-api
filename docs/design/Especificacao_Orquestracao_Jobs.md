# Especificação Técnica: Orquestração de Jobs (Modelo Worker Independente / Pull)

Este documento detalha o planejamento para a execução assíncrona dos processos de processamento de imagens do CanaVision_core através de um modelo onde o Python atua como um microserviço independente que consome tarefas da API.

---

## 1. Visão Geral da Arquitetura
Diferente de um modelo de disparo direto, aqui a API Node.js (Gerente) e o Core Python (Operário) trabalham de forma desacoplada.

*   **API Node.js:** Gerencia a interface com o usuário, autenticação e a fila de intenções (Jobs) no banco de dados.
*   **Core Python:** Microserviço que roda de forma independente (ex: via Cron Job ou Loop a cada X minutos), consulta a API para saber o que processar e devolve o resultado quando terminar.

---

## 2. Requisitos de Negócio (Motivação)
As imagens de satélite (Sentinel-2) possuem uma frequência de atualização de ~3 dias. Portanto:
*   Não há necessidade de processamento em tempo real (instantâneo).
*   O processamento pode ser feito em lotes (batch) ou quando o Worker Python estiver disponível.
*   O isolamento permite que o Python rode em uma máquina com mais RAM/GPU sem afetar o servidor da API.

---

## 3. Fluxo de Trabalho (Workflow)

### Etapa 1: Solicitação (Node.js)
1.  Usuário solicita processamento via Frontend.
2.  API Node valida as permissões e cria um registro na tabela `Job`:
    *   `status`: `pending`
    *   `parametros`: `{ "PropId": "...", "indice": "NDVI", "dataInicio": "...", "dataFim": "..." }`

### Etapa 2: Consulta (Python)
1.  O Core Python acorda e faz uma requisição à API: `GET /api/internal/jobs/next`.
2.  A API retorna o próximo Job `pending` (usando lógica FIFO - primeiro a entrar, primeiro a sair).
3.  O Python marca o Job como `running` via API: `PATCH /api/internal/jobs/:id { "status": "running" }`.

### Etapa 3: Execução (Python)
1.  Python realiza o download das imagens do Copernicus.
2.  Processa os índices biofísicos.
3.  Faz o upload do GeoTIFF final para o Google Cloud Storage (GCS).

### Etapa 4: Finalização (Python -> Node.js)
1.  Python avisa a API que o trabalho foi concluído: `PATCH /api/internal/jobs/:id/complete`.
2.  A API Node.js:
    *   Muda o status do Job para `succeeded`.
    *   Cria o registro na tabela `Artefato` com o link do GCS.
    *   (Opcional) Dispara uma notificação para o usuário.

---

## 4. Endpoints Internos Requeridos (Contrato API/Core)

Para manter a segurança, estes endpoints devem ser protegidos por uma **Chave de API Interna** (Internal API Key).

| Endpoint | Método | Descrição |
| :--- | :---: | :--- |
| `/api/internal/jobs/next` | `GET` | Retorna o próximo job `pending`. |
| `/api/internal/jobs/:id` | `PATCH` | Atualiza status (`running`, `failed`). |
| `/api/internal/jobs/:id/complete` | `POST` | Finaliza o job e envia metadados do arquivo (caminho GCS). |

---

## 5. Estrutura de Dados (Tabela Job)
Campos essenciais no banco:
*   `id` (UUID): Identificador único.
*   `clienteId`: Para isolamento de dados.
*   `status`: enum (`pending`, `running`, `succeeded`, `failed`).
*   `pipeline`: O que deve ser feito (ex: `NDVI_PROCESSOR`).
*   `parametros`: JSON com coordenadas, datas e índices.
*   `resultado_dir`: Caminho no GCS onde o arquivo foi salvo.
*   `erro_mensagem`: Caso o status seja `failed`.

---

## 6. Vantagens do Modelo Independente
1.  **Resiliência:** Se a API cair, o Python continua tentando. Se o Python cair, os pedidos ficam salvos no banco esperando ele voltar.
2.  **Escalabilidade:** Podemos ter 10 instâncias do Python rodando em máquinas diferentes pegando jobs da mesma API.
3.  **Simplicidade:** Não precisamos de sistemas de mensageria complexos (RabbitMQ/Redis) agora. O banco de dados (PostgreSQL) serve como a nossa fila.

---

## 7. Próximos Passos (DoD)
1. [ ] Definir a "Chave de API Interna" no `.env`.
2. [ ] Implementar os endpoints do domínio `/api/jobs` no Node.js.
3. [ ] Ajustar o `main.py` do Core Python para bater nesses endpoints.
4. [ ] Testar o ciclo completo: Criar Job -> Python Puxar -> Python Finalizar.
