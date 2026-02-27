# Endpoint: /propriedades (GET)

## Descrição:
Lista todas as propriedades associadas ao cliente do usuário autenticado.

## Método:
`GET`

## Parâmetros de Requisição:
### Query Params:
Nenhum (atualmente).

### Body:
Nenhum.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`GET /api/propriedades`

**Resposta:**
`Status: 200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Fazenda Horizonte",
    "codigoInterno": "FH-001",
    "clienteId": "1a5845b7-3622-4eaa-9ed3-cec2b25f4aa7",
    "areaHectares": 120.5,
    "culturaPrincipal": "Cana-de-açúcar",
    "safraAtual": "2025/26",
    "createdAt": "2026-02-19T10:00:00Z",
    "updatedAt": "2026-02-19T10:00:00Z"
  }
]
```

---

## Respostas de Erro (O que NÃO fazer):

### 401 Unauthorized:
Token ausente ou inválido.
- **Exemplo de Erro:** Chamar o endpoint sem estar logado.
- **Resposta:**
```json
{
  "message": "Token de autenticação não fornecido."
}
```

### 500 Internal Server Error:
Erro inesperado no banco de dados.
