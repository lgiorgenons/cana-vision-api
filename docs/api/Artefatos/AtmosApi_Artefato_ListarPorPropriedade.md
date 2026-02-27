# Endpoint: /artefatos/propriedade/:propriedadeId (GET)

## Descrição:
Lista todos os artefatos (GeoTIFFs de NDVI, NDWI, etc.) vinculados aos talhões de uma propriedade específica, gerando URLs assinadas temporárias para acesso aos arquivos no Google Cloud Storage.

## Método:
`GET`

## Parâmetros de Requisição:
### Path Params:
- `propriedadeId` (string, UUID, Obrigatório): ID da propriedade para buscar os arquivos.

### Body:
Nenhum.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
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

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
`propriedadeId` inválido.
- **Exemplo de Erro:** `GET /api/artefatos/propriedade/fazenda-x`.
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "propriedadeId",
      "message": "ID da propriedade inválido"
    }
  ]
}
```

### 404 Not Found:
Propriedade não encontrada ou não pertence ao cliente do usuário.
- **Exemplo de Erro:** Tentar listar artefatos de uma fazenda que não existe ou de outro cliente.
- **Resposta:**
```json
{
  "message": "Propriedade não encontrada"
}
```

### 401 Unauthorized:
Usuário não autenticado ou sem cliente associado.

### 500 Internal Server Error:
Erro na comunicação com o Google Cloud Storage ou banco de dados.
- **Exemplo de Erro:** Falha ao gerar a Signed URL no GCS.
- **Resposta:**
```json
{
  "message": "Erro ao gerar URL assinada para o artefato"
}
```
