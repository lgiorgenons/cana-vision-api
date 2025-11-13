# Endpoints implementados (parcial)

## Autenticação (`/api/auth`)

### POST `/auth/register`
- **Descrição**: cria um usuário e dispara o fluxo de confirmação do Supabase Auth.
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
      "refreshToken": "jwt",
      "expiresAt": 1731525279,
      "tokenType": "bearer"
    },
    "provider": "supabase",
    "requiresEmailConfirmation": false
  }
  ```
- **Observações**:
  - Se o projeto Supabase exigir confirmação de e-mail, `tokens` será omitido e `requiresEmailConfirmation=true`. O usuário só obterá sessão após confirmar o e-mail.
- **Erros comuns**:
  - 400 validação inválida (Zod).
  - 409 e-mail já cadastrado.

### POST `/auth/login`
- **Descrição**: autentica via Supabase Auth (respeitando confirmação de e-mail configurada no painel).
- **Body**:
  ```json
  {
    "email": "string (e-mail válido)",
    "password": "string (min 8)"
  }
  ```
- **Resposta 200**: mesmo formato de `register` (com tokens do Supabase).
- **Erros**:
  - 400 validação.
  - 401 credenciais inválidas.

### POST `/auth/forgot-password`
- **Descrição**: aciona `supabase.auth.resetPasswordForEmail`, que envia o e-mail com o link oficial de redefinição.
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
  - `resetToken` só é retornado fora de produção para facilitar testes (útil para testar o endpoint seguinte). O formato enviado é `<userId>.<token>`.

- **Descrição**: aplica uma nova senha usando o token enviado pelo Supabase no link de e-mail.
- **Body**:
  ```json
  {
    "token": "string (token JWT enviado pelo Supabase)",
    "password": "string (min 8)"
  }
  ```
- **Resposta 200**:
  ```json
  {
    "message": "Senha redefinida com sucesso."
  }
  ```
- **Erros comuns**:
  - 400 token inválido ou expirado.
  - 400 payload inválido.

### POST `/auth/refresh-token`
- **Descrição**: gera novo par de tokens a partir de um refresh token válido.
- **Body**:
  ```json
  {
    "refreshToken": "jwt"
  }
  ```
- **Resposta 200**: mesmo formato do `POST /auth/login`.
- **Erros**:
  - 401 refresh token inválido, expirado ou usuário pendente.

### POST `/auth/logout`
- **Descrição**: encerra a sessão atual no Supabase. Aceita (opcionalmente) o refresh token para revogar as sessões ativas do usuário.
- **Body (opcional)**:
  ```json
  {
    "refreshToken": "jwt"
  }
  ```
- **Resposta 200**:
  ```json
  {
    "message": "Logout realizado com sucesso."
  }
  ```

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
- CRUDs de `clientes`, `propriedades`, `talhoes`
- `/api/jobs` para acionar o pipeline core
