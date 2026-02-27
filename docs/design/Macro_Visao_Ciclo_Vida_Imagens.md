# Macro Visão: Ciclo de Vida das Imagens e Processamento [ATMOS:MACRO]

Este documento detalha o fluxo completo de uma imagem de satélite, desde a solicitação do usuário no Frontend até o download do GeoTIFF processado, integrando API Node.js, Banco de Dados, Core Python e Google Cloud Storage.

---

## 1. Fluxo Geral (End-to-End)

1.  **Solicitação (Frontend):** O usuário escolhe um Talhão e um intervalo de datas e pede o índice (ex: NDVI).
2.  **Orquestração (API Node.js):** A API valida a geometria do talhão, cria um **Job** no banco de dados com status `pending`.
3.  **Captura (Worker Python):** O Worker (CanaVision_core) "puxa" o Job da API, identifica a geometria e busca imagens no Copernicus Data Space.
4.  **Processamento (Worker Python):** O motor Python realiza o ETL (Extract, Transform, Load):
    *   **E:** Baixa bandas Sentinel-2.
    *   **T:** Recorta (Crop) o polígono do talhão e calcula os índices espectrais (NDVI, NDWI, etc.).
    *   **L:** Sobe os GeoTIFFs e Mapas HTML gerados para o **Google Cloud Storage (GCS)**.
5.  **Finalização (API Node.js):** O Worker avisa a API que terminou. A API cria registros de **Artefatos** no banco vinculados ao Job.
6.  **Entrega (Frontend):** O usuário clica em baixar; a API gera uma **Signed URL** (URL assinada e temporária) para que o download ocorra direto do GCS.

---

## 2. Modelagem de Dados (Macro)

| Tabela | Responsabilidade no Fluxo |
| :--- | :--- |
| **Talhão** | Fornece a geometria (`geom`) para o recorte da imagem. |
| **Job** | Rastrea o estado do processamento (`pending`, `running`, `succeeded`, `failed`). |
| **Artefato** | Guarda o caminho relativo do arquivo no GCS e metadados (tipo, índice). |
| **Cliente** | Garante o isolamento (multitenancy) no bucket do GCS. |

---

## 3. Especificação Técnica de Interface

### A. Solicitar Processamento (User -> API)
*   **Endpoint:** `POST /api/jobs`
*   **Body:**
```json
{
  "talhaoId": "uuid-talhao",
  "pipeline": "SENTINEL_2_INDICES",
  "parametros": {
    "dataInicio": "2024-01-01",
    "dataFim": "2024-02-01",
    "indices": ["NDVI", "NDWI"],
    "coberturaNuvensMax": 20
  }
}
```

### B. Obter Próxima Tarefa (Worker -> API)
*   **Endpoint:** `GET /api/internal/jobs/next`
*   **Response (200 OK):**
```json
{
  "jobId": "uuid-job",
  "talhao": {
    "id": "uuid-talhao",
    "geometria": "POLYGON((...))"
  },
  "parametros": { "dataInicio": "...", "indices": ["NDVI"] }
}
```

### C. Download/Visualização (User -> API)
*   **Endpoint:** `GET /api/jobs/:id/artifacts`
*   **Response:**
```json
{
  "artefatos": [
    {
      "tipo": "geotiff",
      "indice": "NDVI",
      "signedUrl": "https://storage.googleapis.com/...expires=...signature=...",
      "tamanhoBytes": 1048576
    }
  ]
}
```

---

## 4. Lógica de Verificação de Imagens (Smart Check)

Para evitar reprocessamento desnecessário e custos de download, o sistema segue esta lógica:

1.  **API Check:** Antes de criar um novo Job, a API verifica se já existe um `Artefato` para aquele `Talhão` nas mesmas `Datas` e `Índices`. Se sim, ela pode oferecer o arquivo existente.
2.  **Worker Check (Cache Local):** O Python verifica se o produto SAFE do Sentinel-2 já existe no diretório local de trabalho antes de iniciar o download do Copernicus.
3.  **Worker Check (GCS Cache):** O Python verifica se o GeoTIFF final já existe no Bucket GCS (opcional, para cenários de re-run).

---

## 5. Requisitos de Segurança e Infraestrutura

-   **IAM (Google Cloud):** A Service Account do Worker Python deve ter permissão `roles/storage.objectCreator`.
-   **Signed URLs:** A API Node.js deve ter a chave privada (Service Account JSON) para assinar URLs com expiração curta (ex: 15 minutos).
-   **API Interna:** Todas as rotas `/internal/*` exigem o header `X-Internal-Key`.

---

## 6. Casos de Uso e Fluxos de Exceção

-   **UC.001:** Usuário solicita NDVI e o Sentinel-2 não tem imagens sem nuvens no período -> Job falha com mensagem "Alta cobertura de nuvens".
-   **UC.002:** O Worker cai no meio do processamento -> Job fica travado em `running` -> Um cron job na API deve resetar jobs `running` há mais de 1 hora para `pending`.
-   **UC.003:** O usuário tenta baixar um artefato de outro cliente -> A API bloqueia via validação de `clienteId` no banco.
