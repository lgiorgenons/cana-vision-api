# Endpoint: /auth/logout (POST)

## Descrição:
Encerra a sessão do usuário, limpando os cookies e invalidando o token no servidor.

## Método:
`POST`

## Resposta de Sucesso (200 OK):
### Exemplo de Sucesso (O que fazer):
**Requisição:**
`POST /api/auth/logout`

**Resposta:**
`Status: 200 OK`
```json
{
  "message": "Logout realizado com sucesso."
}
```
---

## Respostas de Erro:
### 401 Unauthorized:
Se o usuário já não estava autenticado.
