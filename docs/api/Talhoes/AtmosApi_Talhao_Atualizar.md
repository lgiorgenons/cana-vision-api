# Endpoint: /talhoes/:id (PUT)

## Descrição:
Atualiza as informações de um talhão. Apenas os campos enviados serão alterados (patch parcial).

## Método:
`PUT`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID, Obrigatório): ID único do talhão.

### Body:
- Todos os campos de `POST /talhoes` são opcionais aqui.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`PUT /api/talhoes/770e8400-e29b-41d4-a716-446655441111`
```json
{
  "nome": "Talhão 01 Atualizado",
  "cultura": "Cana Soca"
}
```

**Resposta:**
`Status: 200 OK`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655441111",
  "nome": "Talhão 01 Atualizado",
  "codigo": "T01",
  "propriedadeId": "550e8400-e29b-41d4-a716-446655440000",
  "areaHectares": 25.0,
  "cultura": "Cana Soca",
  "safra": "2024/25",
  "variedade": "RB867515",
  "createdAt": "2026-02-19T11:00:00Z",
  "updatedAt": "2026-02-19T15:00:00Z"
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
O parâmetro `id` não é um UUID ou o payload é inválido.
- **Exemplo de Erro:** Enviar `variedade` como `null` quando o campo é obrigatório no esquema (se for o caso).
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "variedade",
      "message": "Expected string, received null"
    }
  ]
}
```

### 404 Not Found:
Talhão não encontrado ou pertence a uma propriedade de outro cliente.
- **Exemplo de Erro:** Tentar atualizar talhão de outro cliente.
- **Resposta:**
```json
{
  "message": "Talhão não encontrado."
}
```

### 409 Conflict:
Tentar atualizar o `codigo` para um que já existe em outro talhão da mesma propriedade.
- **Exemplo de Erro:** Alterar o código do talhão `T01` para `T02` quando o `T02` já existe na mesma fazenda.
- **Resposta:**
```json
{
  "message": "Já existe um talhão com este código para a propriedade."
}
```

### 401 Unauthorized:
Não autenticado.
### 500 Internal Server Error:
Erro genérico no banco de dados.
