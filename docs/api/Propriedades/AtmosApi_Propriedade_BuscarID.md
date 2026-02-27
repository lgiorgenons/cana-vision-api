# Endpoint: /propriedades/:id (GET)

## Descrição:
Busca detalhada de uma única propriedade por seu ID único (UUID), incluindo o GeoJSON e a lista de talhões vinculados.

## Método:
`GET`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID, Obrigatório): ID único da propriedade.

### Body:
Nenhum.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`GET /api/propriedades/550e8400-e29b-41d4-a716-446655440000`

**Resposta:**
`Status: 200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Fazenda Horizonte",
  "codigoInterno": "FH-001",
  "clienteId": "1a5845b7-3622-4eaa-9ed3-cec2b25f4aa7",
  "codigoSicar": "BR-SP-3500000-XXXXXXXX",
  "areaHectares": 120.5,
  "culturaPrincipal": "Cana-de-açúcar",
  "safraAtual": "2025/26",
  "geojson": { "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [...] } },
  "createdAt": "2026-02-19T10:00:00Z",
  "updatedAt": "2026-02-19T10:00:00Z",
  "talhoes": [
    {
      "id": "770e8400-e29b-41d4-a716-446655441111",
      "nome": "Talhão 01",
      "codigo": "T01",
      "areaHectares": 25.0,
      "variedade": "RB867515",
      "safra": "2024/25",
      "propriedadeId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-19T11:00:00Z",
      "updatedAt": "2026-02-19T11:00:00Z"
    }
  ]
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
Formato do ID inválido.
- **Exemplo de Erro:** `GET /api/propriedades/fazenda-1` (ID não é um UUID).
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
ID não existe no banco ou pertence a outro cliente.
- **Exemplo de Erro:** `GET /api/propriedades/f47ac10b-58cc-4372-a567-0e02b2c3d479` (UUID inexistente).
- **Resposta:**
```json
{
  "message": "Propriedade não encontrada"
}
```

### 401 Unauthorized:
Não autenticado.
