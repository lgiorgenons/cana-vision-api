# 📄 Atmos API - Gestão de Artefatos (Arquivos e Processados)

> **⚠️ Nota de Implementação (Março/2026):**  
> Os endpoints abaixo adotam o **Identificador Semântico** (`propriedade-data-indice`) para facilitar o parse no Frontend.  
> As URLs de acesso são via **Proxy interno** (`/api/artefatos/:id/download`) para garantir segurança e controle de tenancy.

---

## 1. Listar todos do Cliente (Geral)

### Endpoint: `/api/artefatos` (GET)

**Descrição:**  
Lista todos os artefatos vinculados ao cliente autenticado, abrangendo todas as suas propriedades e talhões. Útil para visões globais ou dashboards iniciais.

**Método:**  
`GET`

**Parâmetros de Requisição:**

**Path Params:**  
Nenhum.

**Query Params:**  
*(Opcional)* Filtros por tipo (ex: `?tipo=geotiff`) podem ser adicionados futuramente.

**Body:**  
Nenhum.

**Resposta de Sucesso (200 OK):**

**Exemplo de Sucesso:**

**Requisição:**  
`GET /api/artefatos`

**Resposta:**  
`Status: 200 OK`

```json
[
  {
    "id": "e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2",
    "identificador": "8cc63dfa-20260308-RGB_TOTAL",
    "tipo": "geotiff",
    "indice": "RGB_TOTAL",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "geradoEm": "2026-03-08T03:05:33.228Z",
    "url": "/api/artefatos/e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2/download",
    "talhao": null,
    "propriedade": {
      "nome": "Usina Moreno"
    }
  },
  {
    "id": "a820340f-80f5-40a5-a99e-d68c50f235c8",
    "identificador": "8cc63dfa-20260308-RGB_T01",
    "tipo": "geotiff",
    "indice": "RGB",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "geradoEm": "2026-03-08T01:32:24.203Z",
    "url": "/api/artefatos/a820340f-80f5-40a5-a99e-d68c50f235c8/download",
    "talhao": {
      "nome": "Talhão 01",
      "propriedade": {
        "nome": "Usina Moreno"
      }
    }
  }
]
```

---

## 2. Listar por Propriedade

### Endpoint: `/api/artefatos/propriedade/:propriedadeId` (GET)

**Descrição:**  
Lista todos os artefatos (GeoTIFFs de NDVI, NDWI, etc.) vinculados aos talhões ou diretamente a uma propriedade específica.

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
    "id": "8d0663d1-f467-4bbe-8099-3e48184b67b7",
    "identificador": "8cc63dfa-20260308-NDVI_TOTAL",
    "tipo": "geotiff",
    "indice": "NDVI_TOTAL",
    "caminho": "sentinel2/fazenda_toda_ndvi.tif",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "geradoEm": "2026-03-08T03:05:32.846Z",
    "url": "/api/artefatos/8d0663d1-f467-4bbe-8099-3e48184b67b7/download",
    "talhao": null,
    "propriedade": {
      "nome": "Usina Moreno",
      "codigo": "USM-001"
    }
  }
]
```

---

## 3. Buscar Individual (View)

### Endpoint: `/api/artefatos/:id` (GET)

**Descrição:**  
Retorna os metadados e a URL de acesso de um único artefato para visualização ou parse de informações.

**Método:**  
`GET`

**Parâmetros de Requisição:**

**Path Params:**
- `id` (string, UUID, Obrigatório): ID único do artefato no banco de dados.

**Body:**  
Nenhum.

**Resposta de Sucesso (200 OK):**

**Exemplo de Sucesso (O que fazer):**

**Requisição:**  
`GET /api/artefatos/e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2`

**Resposta:**  
`Status: 200 OK`

```json
{
  "id": "e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2",
  "identificador": "8cc63dfa-20260308-RGB_TOTAL",
  "tipo": "geotiff",
  "indice": "RGB_TOTAL",
  "dataReferencia": "2026-03-08T00:00:00.000Z",
  "url": "/api/artefatos/e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2/download",
  "metadata": {
    "sensor": "Sentinel-2",
    "escala": "fazenda_completa"
  }
}
```

---

## 4. Download Direto (Proxy Stream)

### Endpoint: `/api/artefatos/:id/download` (GET)

**Descrição:**  
Entrega os bytes do arquivo diretamente para o cliente através de um proxy seguro. O link original do Google Cloud Storage nunca é exposto ao frontend.

**Método:**  
`GET`

**Parâmetros de Requisição:**

**Path Params:**
- `id` (string, UUID, Obrigatório): ID único do artefato.

**Resposta de Sucesso:**
- **Status:** `200 OK`
- **Headers:** 
    - `Content-Type`: `image/tiff` (ou conforme o tipo)
    - `Content-Disposition`: `attachment; filename="usina_moreno_ndvi.tif"`
- **Corpo:** Bytes binários do arquivo.
