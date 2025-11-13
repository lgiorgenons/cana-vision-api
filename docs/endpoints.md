# Endpoints implementados (parcial)

## Autenticação (`/api/auth`)

### POST `/auth/register`
- **Descrição**: cria um novo usuário no Supabase Auth e dispara o fluxo nativo de confirmação (se habilitado no painel).
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
- **Resposta 201** _(quando o Supabase retorna sessão inline)_:
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
      "tokenType": "bearer"
    },
    "provider": "supabase",
    "requiresEmailConfirmation": false
  }
  ```
- **Observações**:
  - Quando a confirmação de e-mail está habilitada no Supabase, `tokens` será omitido e `requiresEmailConfirmation` virá `true`. O usuário precisa clicar no link enviado pelo Supabase para finalizar o cadastro.
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
- **Descrição**: delega ao Supabase o envio do e-mail de redefinição.
- **Body**:
  ```json
  {
    "email": "string (e-mail válido)"
  }
  ```
- **Resposta 200**:
  ```json
  {
    "message": "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha."
  }
  ```
- **Observações**:
  - Sempre retorna 200 para não expor usuários existentes.
  - O e-mail contém o link oficial gerado pelo Supabase (configurado em `SUPABASE_PASSWORD_RESET_REDIRECT`).

### POST `/auth/reset-password`
- **Descrição**: aplica uma nova senha usando o token enviado pelo Supabase no link de e-mail.
- **Body**:
  ```json
  {
    "accessToken": "string (token JWT encaminhado no link do Supabase)",
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
  - 401 refresh token inválido ou usuário inativo.

### POST `/auth/logout`
- **Descrição**: encerra a sessão atual. Aceita (opcionalmente) o refresh token para futura revogação/telemetria.
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
