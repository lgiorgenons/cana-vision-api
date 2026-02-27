# Endpoint: /talhoes/:id (GET)

## Descrição:
Busca detalhada de um único talhão por seu ID único (UUID), incluindo o GeoJSON.

## Método:
`GET`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID, Obrigatório): ID único do talhão.

### Body:
Nenhum.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`GET /api/talhoes/770e8400-e29b-41d4-a716-446655441111`

**Resposta:**
`Status: 200 OK`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655441111",
  "nome": "Talhão 01",
  "codigo": "T01",
  "propriedadeId": "550e8400-e29b-41d4-a716-446655440000",
  "areaHectares": 25.0,
  "cultura": "Cana-de-açúcar",
  "safra": "2024/25",
  "variedade": "RB867515",
  "geojson": { "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [...] } },
  "createdAt": "2026-02-19T11:00:00Z",
  "updatedAt": "2026-02-19T11:00:00Z"
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
O parâmetro `id` não é um UUID válido.
- **Exemplo de Erro:** `GET /api/talhoes/meu-talhao-1`.
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "id",
      "message": "ID inválido"
    }
  ]
}
```

### 404 Not Found:
Talhão não encontrado ou pertence a uma propriedade de outro cliente.
- **Exemplo de Erro:** Tentar buscar talhão com ID inexistente.
- **Resposta:**
```json
{
  "message": "Talhão não encontrado."
}
```

### 401 Unauthorized:
Não autenticado.
### 500 Internal Server Error:
Erro ao consultar banco de dados.
