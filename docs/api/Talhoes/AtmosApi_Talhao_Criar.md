# Endpoint: /talhoes (POST)

## Descrição:
Cria um novo talhão dentro de uma propriedade do cliente autenticado.

## Método:
`POST`

## Parâmetros de Requisição:
### Body:
- `nome` (string, Obrigatório): Nome do talhão (ex: "Talhão 01 - Cana Sul").
- `codigo` (string, Obrigatório): Identificação alfa-numérica do talhão.
- `propriedadeId` (string, UUID, Obrigatório): ID da propriedade vinculada.
- `geojson` (object, Opcional): Polígono do talhão.
- `areaHectares` (number, Opcional): Área em hectares.
- `cultura` (string, Opcional): Tipo de plantio (ex: "Cana-de-açúcar").
- `safra` (string, Opcional): Ano de referência (ex: "2024/25").
- `variedade` (string, Opcional): Tipo de espécie (ex: "RB867515").
- `metadata` (object, Opcional): Campos flexíveis.

## Resposta de Sucesso (201 Created):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`POST /api/talhoes`
```json
{
  "nome": "Talhão 01",
  "codigo": "T01",
  "propriedadeId": "550e8400-e29b-41d4-a716-446655440000",
  "areaHectares": 25.0,
  "cultura": "Cana-de-açúcar",
  "safra": "2024/25",
  "variedade": "RB867515"
}
```

**Resposta:**
`Status: 201 Created`
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
  "createdAt": "2026-02-19T11:00:00Z",
  "updatedAt": "2026-02-19T11:00:00Z"
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
Ausência de campos obrigatórios ou IDs inválidos.
- **Exemplo de Erro:** Enviar `propriedadeId` com valor `"fazenda-x"`.
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "propriedadeId",
      "message": "ID de propriedade inválido"
    }
  ]
}
```

### 404 Not Found:
A `propriedadeId` informada não foi encontrada ou não pertence ao cliente logado.
- **Exemplo de Erro:** Tentar criar talhão em uma propriedade que não existe ou é de outro cliente.
- **Resposta:**
```json
{
  "message": "Propriedade não encontrada ou não pertence ao cliente."
}
```

### 409 Conflict:
Já existe um talhão com este `codigo` dentro desta propriedade.
- **Exemplo de Erro:** Tentar criar dois talhões com o código `T01` na mesma fazenda.
- **Resposta:**
```json
{
  "message": "Já existe um talhão com este código para a propriedade."
}
```

### 401 Unauthorized:
Token ausente ou inválido.
