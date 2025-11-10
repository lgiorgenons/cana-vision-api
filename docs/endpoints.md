# Endpoints implementados (parcial)

## Autenticação (`/api/auth`)

### POST `/auth/register`
- **Descrição**: cria um novo usuário interno/cliente.
- **Body**:
  ```json
  {
    "nome": "string (min 3, max 150)",
    "email": "string (e-mail válido)",
    "password": "string (min 8)",
    "role": "admin|gestor|analista|cliente (opcional, default cliente)",
    "clienteId": "uuid ou null (opcional)"
  }
  ```
- **Resposta 201**:
  ```json
  {
    "user": {
      "id": "uuid",
      "nome": "string",
      "email": "string",
      "role": "string",
      "clienteId": "uuid|null"
    },
    "tokens": {
      "accessToken": "jwt",
      "refreshToken": "jwt"
    }
  }
  ```
- **Erros comuns**:
  - 400 validação inválida (Zod).
  - 409 e-mail já cadastrado.

### POST `/auth/login`
- **Descrição**: autentica usuário existente.
- **Body**:
  ```json
  {
    "email": "string (e-mail válido)",
    "password": "string (min 8)"
  }
  ```
- **Resposta 200**: mesmo formato de `register`.
- **Erros**:
  - 400 validação.
  - 401 credenciais inválidas.

### POST `/auth/forgot-password`
- **Descrição**: inicia fluxo de redefinição de senha.
- **Body**:
  ```json
  {
    "email": "string (e-mail válido)"
  }
  ```
- **Resposta 200**:
  ```json
  {
    "message": "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.",
    "resetToken": "string (somente ambientes não-produtivos)"
  }
  ```
- **Observações**:
  - Sempre retorna 200 para não expor usuários existentes.
  - `resetToken` só é retornado fora de produção para facilitar testes (útil para testar o endpoint seguinte).

### POST `/auth/reset-password` _(em desenvolvimento)_
- **Objetivo**: receber `token` + `password` e concretizar a redefinição.
- **Status**: pendente (depende de template de e-mail e fila de notificações).

## Saúde (`/api/health`)
- **GET `/health`**
  - **Descrição**: sanity check simples.
  - **Resposta 200**:
    ```json
    { "status": "ok" }
    ```

## Notas de uso
- Todos os endpoints vivem sob `/api`, portanto a URL base é `https://<host>/api/...` (ex.: Cloud Run `https://canavision-api-XXXX.a.run.app/api/auth/login`).
- Autenticação posterior aos fluxos acima seguirá o padrão `Authorization: Bearer <accessToken>`.
- Revise sempre o `.env` para garantir que as variáveis JWT e o `DATABASE_URL` utilizados localmente sejam equivalentes aos de produção.

## Próximos endpoints planejados
- `POST /auth/reset-password`
- `POST /auth/refresh-token`
- `POST /auth/logout`
- CRUDs de `clientes`, `propriedades`, `talhoes`
- `/api/jobs` para acionar o pipeline core
