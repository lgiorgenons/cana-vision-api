# 📄 Atmos API - Gestão de Artefatos (Arquivos e Processados)

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
    "id": "990e8400-e29b-41d4-a716-446655449999",
    "tipo": "geotiff",
    "indice": "NDVI",
    "geradoEm": "2025-12-29T10:00:00Z",
    "url": "/api/artefatos/990e8400-e29b-41d4-a716-446655449999/download",
    "talhao": {
      "nome": "Talhão 01",
      "propriedade": {
        "nome": "Fazenda São João"
      }
    }
  },
  {
    "id": "880e7400-...",
    "tipo": "geotiff",
    "indice": "NDWI",
    "talhao": {
      "nome": "Talhão Sul",
      "propriedade": {
        "nome": "Fazenda Boa Vista"
      }
    }
  }
]
```

---

## 2. Listar por Propriedade

### Endpoint: `/api/artefatos/propriedade/:propriedadeId` (GET)

**Descrição:**  
Lista todos os artefatos (GeoTIFFs de NDVI, NDWI, etc.) vinculados aos talhões de uma propriedade específica, gerando URLs assinadas temporárias para acesso aos arquivos no Google Cloud Storage.

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
`GET /api/artefatos/propriedade/550e8400-e29b-41d4-a716-446655440000`

**Resposta:**  
`Status: 200 OK`
```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655449999",
    "tipo": "geotiff",
    "indice": "NDVI",
    "caminho": "processed/550e8400-e29b-41d4-a716-446655440000/2025-12-29_NDVI.tif",
    "geradoEm": "2025-12-29T10:00:00Z",
    "url": "https://storage.googleapis.com/atmos-agro-data-lake-dev/processed/...&X-Goog-Signature=...",
    "talhao": {
      "nome": "Talhão 01",
      "codigo": "T01"
    }
  }
]
```

**Respostas de Erro (O que NÃO fazer):**

- **400 Bad Request:** `propriedadeId` inválido.
- **404 Not Found:** Propriedade não encontrada ou não pertence ao cliente do usuário.
- **401 Unauthorized:** Usuário não autenticado ou sem cliente associado.
- **500 Internal Server Error:** Erro na comunicação com o Google Cloud Storage ou banco de dados.

---

## 2. Buscar Individual (View)

### Endpoint: `/api/artefatos/:id` (GET)

**Descrição:**  
Retorna os metadados e a URL assinada de um único artefato para visualização imediata ou integração em mapas.

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
`GET /api/artefatos/990e8400-e29b-41d4-a716-446655449999`

**Resposta:**  
`Status: 200 OK`
```json
{
  "id": "990e8400-e29b-41d4-a716-446655449999",
  "tipo": "geotiff",
  "indice": "NDVI",
  "url": "https://storage.googleapis.com/... (URL ASSINADA)",
  "geradoEm": "2025-12-29T10:00:00Z",
  "metadata": {
    "sensor": "Sentinel-2",
    "nuvens": 0.05
  }
}
```

**Respostas de Erro (O que NÃO fazer):**

- **400 Bad Request:** ID do artefato em formato inválido.
- **404 Not Found:** Artefato não encontrado.
- **403 Forbidden:** Acesso negado (artefato pertence a outro cliente).
- **500 Internal Server Error:** Falha na geração do link seguro.

---

## 3. Download Direto (Proxy Stream)

### Endpoint: `/api/artefatos/:id/download` (GET)

**Descrição:**  
Entrega os bytes do arquivo diretamente para o cliente através de um proxy seguro. O link original do Google Cloud Storage nunca é exposto ao frontend.

**Método:**  
`GET`

**Parâmetros de Requisição:**

**Path Params:**
- `id` (string, UUID, Obrigatório): ID único do artefato.

**Body:**  
Nenhum.

**Resposta de Sucesso:**

**Exemplo de Sucesso (O que fazer):**

**Requisição:**  
`GET /api/artefatos/990e8400-e29b-41d4-a716-446655449999/download`

**Resposta:**  
`Status: 200 OK`  
`Content-Type: image/tiff` (ou conforme o tipo do arquivo)  
`Content-Disposition: attachment; filename="2025-12-29_NDVI.tif"`  
*(Corpo da resposta contém os bytes binários do arquivo)*

**Respostas de Erro (O que NÃO fazer):**

- **401 Unauthorized:** Usuário sem sessão ativa.
- **403 Forbidden:** Usuário tentando baixar arquivo de outro cliente.
- **404 Not Found:** Artefato inexistente.
- **500 Internal Server Error:** Erro ao ler arquivo do storage.
