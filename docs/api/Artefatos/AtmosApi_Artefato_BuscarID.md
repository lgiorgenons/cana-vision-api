# Endpoint: /api/artefatos/:id (GET)

## Descrição:
Retorna os metadados completos e a URL de download (proxy) de um único artefato específico. Este endpoint é ideal para buscar detalhes de uma única imagem ou para visualizar metadados de processamento (ex: sensor, nuvens).

## Método:
`GET`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID, Obrigatório): ID único do artefato no banco de dados.

### Body:
Nenhum.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso:
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
  "geradoEm": "2026-03-08T03:05:33.228Z",
  "url": "/api/artefatos/e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2/download",
  "caminho": "sentinel2/fazenda_toda_rgb.tif",
  "checksum": "sha256:...",
  "metadata": {
    "sensor": "Sentinel-2",
    "escala": "fazenda_completa",
    "nuvens": 0.05
  }
}
```

---

## Respostas de Erro:

### 400 Bad Request:
ID do artefato em formato inválido (não é um UUID).

### 404 Not Found:
Artefato não encontrado no banco de dados.

### 403 Forbidden:
O artefato pertence a outro cliente. Acesso negado.

### 500 Internal Server Error:
Erro interno ao processar a consulta.
