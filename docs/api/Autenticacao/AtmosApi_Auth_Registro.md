# Endpoint: /auth/register (POST)

## Descrição:
Cria uma nova conta de usuário no sistema. Se configurado, enviará e-mail de confirmação via Supabase.

## Método:
`POST`

## Parâmetros de Requisição:
### Body:
- `nome` (string, min 3, Obrigatório): Nome completo.
- `email` (string, Obrigatório): E-mail único.
- `password` (string, min 8, Obrigatório): Senha.
- `role` (string, Opcional): Papel do usuário (admin, gestor, cliente). Default: `cliente`.
- `clienteId` (string, UUID, Opcional): Vincular a um cliente existente.

## Resposta de Sucesso (201 Created):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`POST /api/auth/register`
```json
{
  "nome": "Maria Pereira",
  "email": "maria@fazenda.com",
  "password": "senhaSuperSegura"
}
```

**Resposta:**
`Status: 201 Created`
```json
{
  "user": {
    "id": "uuid-novo-usuario",
    "nome": "Maria Pereira",
    "email": "maria@fazenda.com",
    "role": "cliente",
    "clienteId": "uuid-do-cliente-padrao"
  },
  "requiresEmailConfirmation": false
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 409 Conflict:
E-mail já cadastrado no sistema.
- **Resposta:**
```json
{
  "message": "E-mail já está em uso."
}
```

### 400 Bad Request:
Senha muito curta ou campos inválidos.
- **Exemplo de Erro:** `"password": "123"`.
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "password",
      "message": "String must contain at least 8 character(s)"
    }
  ]
}
```
