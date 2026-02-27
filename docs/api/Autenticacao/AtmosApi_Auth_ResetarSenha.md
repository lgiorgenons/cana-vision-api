# Endpoint: /auth/reset-password (POST)

## Descrição:
Aplica uma nova senha usando o token enviado por e-mail pelo Supabase.

## Método:
`POST`

## Parâmetros de Requisição:
### Body:
- `accessToken` (string, Obrigatório): Token JWT enviado no link de reset do e-mail.
- `password` (string, min 8, Obrigatório): Nova senha.

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`POST /api/auth/reset-password`
```json
{
  "accessToken": "eyJhbGciOi...",
  "password": "MinhaNovaSenha123"
}
```

**Resposta:**
`Status: 200 OK`
```json
{
  "message": "Senha redefinida com sucesso."
}
```

---

## Respostas de Erro (O que NÃO fazer):

### 400 Bad Request:
Token expirado ou inválido.
- **Resposta:**
```json
{
  "message": "Erro de validação ou token expirado."
}
```
