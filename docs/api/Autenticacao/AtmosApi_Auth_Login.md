# Endpoint: /auth/login (POST)

## Descrição:
Autentica um usuário existente e retorna o token de acesso (JWT) via cookie e dados do usuário.

## Método:
`POST`

## Parâmetros de Requisição:
### Body:
- `email` (string, e-mail válido, Obrigatório): E-mail do usuário.
- `password` (string, min 8 caracteres, Obrigatório): Senha do usuário.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`POST /api/auth/login`
```json
{
  "email": "usuario@exemplo.com",
  "password": "senhaSegura123"
}
```

**Resposta:**
`Status: 200 OK`
- Além da resposta JSON, o cookie `accessToken` é definido no navegador com a flag `httpOnly`.
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "nome": "João da Silva",
    "email": "usuario@exemplo.com",
    "role": "gestor",
    "clienteId": "uuid-do-cliente"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiI...",
    "refreshToken": "eyJhbGciOiJIUzI1NiI...",
    "tokenType": "bearer"
  }
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 401 Unauthorized:
E-mail ou senha incorretos.
- **Exemplo de Erro:** Senha errada.
- **Resposta:**
```json
{
  "message": "Credenciais inválidas."
}
```

### 400 Bad Request:
Formato de e-mail inválido ou campos ausentes.
- **Exemplo de Erro:** Enviar `"email": "email-invalido"`.
- **Resposta:**
```json
{
  "message": "Erro de validação",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email"
    }
  ]
}
```
