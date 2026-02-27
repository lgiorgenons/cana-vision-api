# Endpoint: /propriedades/:propriedadeId/talhoes (GET)

## Descrição:
Lista todos os talhões vinculados a uma propriedade específica. Esta é a rota **aninhada (nested)** recomendada para navegação hierárquica (ex: "Entrar na Fazenda X para ver seus talhões").

## Observação Semântica:
Utilize esta rota quando o contexto da aplicação for a **Propriedade**. Ela reforça a relação de pertencimento entre Propriedade e Talhão, sendo a escolha ideal para interfaces de navegação por fazendas.

## Método:
`GET`

## Parâmetros de Requisição:
### Path Params:
- `propriedadeId` (string, UUID, Obrigatório): ID da propriedade pai.

### Body:
Nenhum.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`GET /api/propriedades/550e8400-e29b-41d4-a716-446655440000/talhoes`

**Resposta:**
`Status: 200 OK`
```json
[
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
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
O parâmetro `propriedadeId` não é um UUID válido.
- **Exemplo de Erro:** `GET /api/propriedades/fazenda-x/talhoes`.
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
A `propriedadeId` informada não foi encontrada ou não pertence ao cliente do usuário.
- **Exemplo de Erro:** Tentar listar talhões de uma fazenda de outro cliente.
- **Resposta:**
```json
{
  "message": "Propriedade não encontrada"
}
```

### 401 Unauthorized:
Não autenticado.
### 500 Internal Server Error:
Erro genérico no banco.
