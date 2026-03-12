# 📄 Atmos API - Listar Artefatos por Propriedade

## Endpoint: `/api/artefatos/propriedade/:propriedadeId` (GET)

**Descrição:**  
Lista todos os artefatos (GeoTIFFs de NDVI, NDWI, etc.) vinculados a uma propriedade específica. Isso inclui tanto os processamentos globais da fazenda (ex: NDVI_TOTAL) quanto os processamentos individuais de cada talhão pertencente a ela. 

> **Nota:** O endpoint utiliza o **Identificador Semântico** (`propriedade-data-indice`) para facilitar o agrupamento no Frontend.

**Método:**  
`GET`

**Parâmetros de Requisição:**

**Path Params:**
- `propriedadeId` (string, UUID, Obrigatório): ID da propriedade para buscar os arquivos.

**Body:**  
Nenhum.

**Resposta de Sucesso (200 OK):**

**Exemplo de Sucesso (O que fazer):**

**Requisição:**  
`GET /api/artefatos/propriedade/8cc63dfa-42c9-4b84-a950-72077b283435`

**Resposta:**  
`Status: 200 OK`

```json
[
  {
    "id": "e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2",
    "identificador": "8cc63dfa-20260308-RGB_TOTAL",
    "propriedadeId": "8cc63dfa-42c9-4b84-a950-72077b283435",
    "tipo": "geotiff",
    "indice": "RGB_TOTAL",
    "caminho": "sentinel2/fazenda_toda_rgb.tif",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "geradoEm": "2026-03-08T03:05:33.228Z",
    "url": "/api/artefatos/e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2/download",
    "metadata": {
        "escala": "fazenda_completa",
        "sensor": "Sentinel-2"
    },
    "talhao": null,
    "propriedade": {
        "nome": "Usina Moreno"
    }
  },
  {
    "id": "a820340f-80f5-40a5-a99e-d68c50f235c8",
    "identificador": "8cc63dfa-20260308-RGB_T01",
    "propriedadeId": "8cc63dfa-42c9-4b84-a950-72077b283435",
    "talhaoId": "81c8e3d3-0eab-4412-b248-8d1cc2f21ba6",
    "tipo": "geotiff",
    "indice": "RGB",
    "caminho": "sentinel2/rgb_test_mock.tif",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "geradoEm": "2026-03-08T01:32:24.203Z",
    "url": "/api/artefatos/a820340f-80f5-40a5-a99e-d68c50f235c8/download",
    "talhao": {
        "nome": "Talhão 01",
        "codigo": "T01"
    },
    "propriedade": {
        "nome": "Usina Moreno"
    }
  }
]
```

---

**Respostas de Erro (O que NÃO fazer):**

**400 Bad Request:** `propriedadeId` inválido.

**404 Not Found:** Propriedade não encontrada ou não pertence ao cliente do usuário.

**401 Unauthorized:** Usuário não autenticado ou sem cliente associado.

**500 Internal Server Error:** Erro na comunicação com o Google Cloud Storage ou banco de dados.
