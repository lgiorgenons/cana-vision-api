# Endpoint: /propriedades (POST)

## Descrição:
Cria uma nova propriedade vinculada ao cliente do usuário autenticado.

## Método:
`POST`

## Parâmetros de Requisição:
### Body:
- `nome` (string, Obrigatório): Nome descritivo da propriedade (ex: "Fazenda Santa Cruz").
- `codigoInterno` (string, Obrigatório): Código de identificação interna do cliente.
- `codigoSicar` (string, Opcional): Código CAR (Cadastro Ambiental Rural).
- `geojson` (object, Opcional): Geometria da propriedade em formato GeoJSON.
- `areaHectares` (number, Opcional): Área total em hectares.
- `culturaPrincipal` (string, Opcional): Cultura predominante (ex: "Cana-de-açúcar").
- `safraAtual` (string, Opcional): Safra de referência (ex: "2024/25").
- `metadata` (object, Opcional): Dados adicionais em formato chave-valor.

## Resposta de Sucesso (201 Created):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`POST /api/propriedades`
```json
{
  "nome": "Fazenda Horizonte",
  "codigoInterno": "FH-001",
  "codigoSicar": "BR-SP-3500000-XXXXXXXX",
  "areaHectares": 120.5,
  "culturaPrincipal": "Cana-de-açúcar",
  "safraAtual": "2025/26"
}
```

**Resposta:**
`Status: 201 Created`
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
  "createdAt": "2026-02-19T14:00:00Z",
  "updatedAt": "2026-02-19T14:00:00Z"
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
Ocorre se algum campo obrigatório estiver ausente ou o formato for inválido.
- **Exemplo de Erro:** Enviar sem o campo `nome`.
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "nome",
      "message": "Nome é obrigatório"
    }
  ]
}
```

### 409 Conflict:
Ocorre quando o `codigoInterno` já está em uso para este cliente.
- **Exemplo de Erro:** Tentar criar duas fazendas com o código `FH-001`.
- **Resposta:**
```json
{
  "message": "Já existe uma propriedade com este código interno para o cliente ou com o mesmo código CAR."
}
```

### 401 Unauthorized:
Token ausente ou inválido.
