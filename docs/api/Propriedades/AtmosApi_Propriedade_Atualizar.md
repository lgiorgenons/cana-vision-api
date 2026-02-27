# Endpoint: /propriedades/:id (PUT)

## Descrição:
Atualiza as informações de uma propriedade existente. Apenas os campos enviados serão alterados (patch parcial).

## Método:
`PUT`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID, Obrigatório): ID da propriedade a ser atualizada.

### Body:
- Todos os campos de `POST /propriedades` são opcionais aqui.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`PUT /api/propriedades/550e8400-e29b-41d4-a716-446655440000`
```json
{
  "nome": "Fazenda Horizonte Atualizada",
  "safraAtual": "2026/27"
}
```

**Resposta:**
`Status: 200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Fazenda Horizonte Atualizada",
  "codigoInterno": "FH-001",
  "clienteId": "1a5845b7-3622-4eaa-9ed3-cec2b25f4aa7",
  "areaHectares": 120.5,
  "culturaPrincipal": "Cana-de-açúcar",
  "safraAtual": "2026/27",
  "createdAt": "2026-02-19T10:00:00Z",
  "updatedAt": "2026-02-19T14:30:00Z"
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
Ocorre se o ID for inválido ou se os campos enviados não seguirem o formato.
- **Exemplo de Erro:** Enviar `areaHectares` como string.
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "areaHectares",
      "message": "Expected number, received string"
    }
  ]
}
```

### 404 Not Found:
ID não existe no banco ou pertence a outro cliente.
- **Exemplo de Erro:** `PUT /api/propriedades/f47ac10b-58cc-4372-a567-0e02b2c3d479` (UUID inexistente).
- **Resposta:**
```json
{
  "message": "Propriedade não encontrada"
}
```

### 409 Conflict:
Tentar atualizar o `codigoInterno` para um que já existe em outra propriedade do mesmo cliente.
- **Exemplo de Erro:** Alterar o código de uma fazenda para `FH-002` quando a `FH-002` já existe.
- **Resposta:**
```json
{
  "message": "Já existe uma propriedade com este código interno para o cliente ou com o mesmo código CAR."
}
```

### 401 Unauthorized:
Não autenticado.
