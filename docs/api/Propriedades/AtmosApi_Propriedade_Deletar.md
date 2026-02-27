# Endpoint: /propriedades/:id (DELETE)

## Descrição:
Remove permanentemente uma propriedade e todos os talhões associados a ela (Cascading delete).

## Método:
`DELETE`

## Parâmetros de Requisição:
### Query Params:
Nenhum.

### Path Params:
- `id` (string, UUID, Obrigatório): ID único da propriedade.

### Body:
Nenhum.

## Resposta de Sucesso (204 No Content):
### Body:
Corpo vazio.

### Exemplo de Sucesso (O que fazer):
**Requisição:**
`DELETE /api/propriedades/550e8400-e29b-41d4-a716-446655440000`

**Resposta:**
`Status: 204 No Content` (Sem corpo).

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
Ocorre quando o formato do ID enviado é inválido.
- **Exemplo de Erro:** `DELETE /api/propriedades/minha-fazenda-123` (ID não é um UUID).
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

### 401 Unauthorized:
Token ausente ou usuário sem `clienteId` vinculado.
- **Exemplo de Erro:** Chamar o endpoint sem o header `Authorization` ou sem o cookie de sessão.

### 404 Not Found:
Ocorre quando o ID é um UUID válido, mas não existe no banco ou pertence a outro cliente.
- **Exemplo de Erro:** `DELETE /api/propriedades/f47ac10b-58cc-4372-a567-0e02b2c3d479` (UUID inexistente).
- **Resposta:**
```json
{
  "message": "Propriedade não encontrada"
}
```

### 500 Internal Server Error:
Erro inesperado no servidor ou falha de conexão com o banco de dados.
