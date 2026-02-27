# Endpoint: /talhoes (GET)

## Descrição:
Lista os talhões do cliente autenticado. Esta é uma rota **plana (flat)**, ideal para listagens gerais, dashboards e filtros que podem abranger múltiplas propriedades.

## Observação Semântica:
Atualmente, a `propriedadeId` é obrigatória, mas esta rota foi projetada para evoluir e permitir filtros globais (ex: listar todos os talhões de Cana-de-Açúcar do cliente). Para navegação hierárquica por fazenda, prefira a rota `/api/propriedades/:id/talhoes`.

## Método:
`GET`

## Parâmetros de Requisição:
### Query Params:
- `propriedadeId` (string, UUID, Obrigatório): ID da propriedade pai.

### Body:
Nenhum.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`GET /api/talhoes?propriedadeId=550e8400-e29b-41d4-a716-446655440000`

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
O parâmetro `propriedadeId` na query string não foi informado ou não é um UUID.
- **Exemplo de Erro:** `GET /api/talhoes` (sem `propriedadeId`).
- **Resposta:**
```json
{
  "message": "O ID da propriedade é obrigatório para listar os talhões."
}
```

### 404 Not Found:
A propriedade informada não foi encontrada ou não pertence ao cliente logado.
- **Exemplo de Erro:** Tentar listar talhões de uma fazenda que não existe ou é de outro cliente.
- **Resposta:**
```json
{
  "message": "Propriedade não encontrada ou não pertence ao cliente."
}
```

### 401 Unauthorized:
Não autenticado.
