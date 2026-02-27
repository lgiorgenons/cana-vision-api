# Endpoint: /talhoes/:id (DELETE)

## Descrição:
Remove permanentemente um talhão.

## Método:
`DELETE`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID, Obrigatório): ID único do talhão.

### Body:
Nenhum.

## Resposta de Sucesso (204 No Content):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`DELETE /api/talhoes/770e8400-e29b-41d4-a716-446655441111`

**Resposta:**
`Status: 204 No Content` (Sem corpo).

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
O parâmetro `id` não é um UUID válido.
- **Exemplo de Erro:** `DELETE /api/talhoes/talhao-1`.
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
Não autenticado.

### 404 Not Found:
Talhão não encontrado ou pertence a uma propriedade de outro cliente.
- **Exemplo de Erro:** Tentar deletar um talhão inexistente ou de outro cliente.
- **Resposta:**
```json
{
  "message": "Talhão não encontrado."
}
```

### 500 Internal Server Error:
Erro genérico no banco de dados.
