# Documentação dos Endpoints - Propriedades e Talhões

## Autenticação e Autorização

Todos os endpoints descritos abaixo são protegidos e requerem um token de autenticação válido (JWT) no cabeçalho `Authorization`. O `clienteId` do usuário é extraído diretamente do token, garantindo que um usuário só possa visualizar e gerenciar recursos que pertencem ao seu próprio cliente.

- **`401 Unauthorized`**: Retornado se o token não for fornecido ou for inválido.
- **`404 Not Found`**: Retornado ao tentar acessar um recurso que não existe ou não pertence ao seu cliente.

## Validação

Os parâmetros de rota que esperam um ID (ex: `/api/propriedades/:id`) são validados para garantir que são um UUID válido. Enviar um formato de ID inválido resultará em um erro `400 Bad Request`.

---

# Endpoints de Propriedades

**Caminho Base:** `/api/propriedades`

### 1. Criar Propriedade
- **Endpoint:** `POST /api/propriedades`
- **Descrição:** Cria uma nova propriedade. O `clienteId` no corpo da requisição deve ser o mesmo do cliente associado ao usuário autenticado.
- **Input (Body):** `CreatePropriedadeDto` (JSON)
  ```json
  {
    "nome": "Fazenda Boa Esperança",
    "codigoInterno": "FBE-01",
    "clienteId": "uuid-do-cliente-do-usuario-logado",
    "codigoSicar": "CAR-12345-BR",
    "areaHectares": 350.75
  }
  ```
- **Output (Sucesso 201):** Objeto `Propriedade` completo (JSON), incluindo o campo `geojson`.
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: Erro de validação nos dados enviados.
    - `401 Unauthorized`: O `clienteId` no corpo não corresponde ao do usuário autenticado.
    - `409 Conflict`: Se já existir uma propriedade com o mesmo `codigoInterno` ou `codigoSicar`.

### 2. Listar Propriedades
- **Endpoint:** `GET /api/propriedades`
- **Descrição:** Retorna todas as propriedades do cliente associado ao usuário autenticado.
- **Input:** Nenhum.
- **Output (Sucesso 200):** Array de objetos `Propriedade` (JSON), **sem** o campo `geojson`.
- **Outputs (Erros Comuns):**
    - `401 Unauthorized`: Usuário não associado a um cliente.

### 3. Obter Detalhes da Propriedade
- **Endpoint:** `GET /api/propriedades/:id`
- **Descrição:** Retorna os detalhes de uma única propriedade pelo seu ID.
- **Input (Parâmetro de Rota):** `id` (string, UUID)
- **Output (Sucesso 200):** Objeto `Propriedade` (JSON), incluindo `geojson` e um array `talhoes` (sem o `geojson` de cada talhão).
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: ID com formato inválido.
    - `404 Not Found`: Propriedade não encontrada ou não pertence ao cliente do usuário.

### 4. Atualizar Propriedade
- **Endpoint:** `PUT /api/propriedades/:id`
- **Descrição:** Atualiza uma propriedade existente.
- **Input (Body):** `UpdatePropriedadeDto` (JSON, com campos parciais)
- **Output (Sucesso 200):** Objeto `Propriedade` atualizado (JSON).
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: ID com formato inválido ou erro de validação nos dados.
    - `404 Not Found`: Propriedade não encontrada ou não pertence ao cliente do usuário.
    - `409 Conflict`: Se a atualização resultar em um `codigoInterno` ou `codigoSicar` duplicado.

### 5. Deletar Propriedade
- **Endpoint:** `DELETE /api/propriedades/:id`
- **Descrição:** Deleta uma propriedade pelo seu ID.
- **Output (Sucesso 204):** Sem conteúdo.
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: ID com formato inválido.
    - `404 Not Found`: Propriedade não encontrada ou não pertence ao cliente do usuário.

### 6. Listar Talhões de uma Propriedade
- **Endpoint:** `GET /api/propriedades/:propriedadeId/talhoes`
- **Descrição:** Retorna todos os talhões de uma propriedade específica.
- **Input (Parâmetro de Rota):** `propriedadeId` (string, UUID)
- **Output (Sucesso 200):** Array de objetos `Talhao` (JSON), **sem** o campo `geojson`.
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: ID da propriedade com formato inválido.
    - `404 Not Found`: Propriedade não encontrada ou não pertence ao cliente do usuário.

---

# Endpoints de Talhões

**Caminho Base:** `/api/talhoes`

### 1. Criar Talhão
- **Endpoint:** `POST /api/talhoes`
- **Descrição:** Cria um novo talhão associado a uma propriedade.
- **Input (Body):** `CreateTalhaoDto` (JSON)
  ```json
  {
    "nome": "Talhão Setor 5",
    "codigo": "TS-05",
    "propriedadeId": "uuid-da-propriedade",
    "areaHectares": 25.5
  }
  ```
- **Output (Sucesso 201):** Objeto `Talhao` completo (JSON), incluindo `geojson`.
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: Erro de validação nos dados.
    - `404 Not Found`: `propriedadeId` não encontrada ou não pertence ao cliente do usuário.
    - `409 Conflict`: Se já existir um talhão com o mesmo `codigo` para a propriedade.

### 2. Listar Talhões
- **Endpoint:** `GET /api/talhoes`
- **Descrição:** Retorna os talhões de uma propriedade específica.
- **Input (Query Parameter Obrigatório):** `propriedadeId` (string, UUID)
- **Output (Sucesso 200):** Array de objetos `Talhao` (JSON), **sem** o campo `geojson`.
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: `propriedadeId` não fornecido ou com formato inválido.
    - `404 Not Found`: Propriedade não encontrada ou não pertence ao cliente do usuário.

### 3. Obter Detalhes do Talhão
- **Endpoint:** `GET /api/talhoes/:id`
- **Descrição:** Retorna os detalhes de um único talhão.
- **Input (Parâmetro de Rota):** `id` (string, UUID)
- **Output (Sucesso 200):** Objeto `Talhao` com todos os seus dados (JSON), **incluindo** o campo `geojson`.
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: ID com formato inválido.
    - `404 Not Found`: Talhão não encontrado ou não pertence ao cliente do usuário.

### 4. Atualizar Talhão
- **Endpoint:** `PUT /api/talhoes/:id`
- **Descrição:** Atualiza um talhão existente.
- **Input (Body):** `UpdateTalhaoDto` (JSON, com campos parciais)
- **Output (Sucesso 200):** Objeto `Talhao` atualizado (JSON).
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: ID com formato inválido ou erro de validação.
    - `404 Not Found`: Talhão não encontrado ou não pertence ao cliente do usuário.
    - `409 Conflict`: Se a atualização resultar em um `codigo` duplicado para a mesma propriedade.

### 5. Deletar Talhão
- **Endpoint:** `DELETE /api/talhoes/:id`
- **Descrição:** Deleta um talhão pelo seu ID.
- **Output (Sucesso 204):** Sem conteúdo.
- **Outputs (Erros Comuns):**
    - `400 Bad Request`: ID com formato inválido.
    - `404 Not Found`: Talhão não encontrado ou não pertence ao cliente do usuário.

---
# API Documentation - Properties and Plots

## Authentication and Authorization

All endpoints described below are protected and require a valid authentication token (JWT) in the `Authorization` header. The user's `clienteId` is extracted directly from the token, ensuring that a user can only view and manage resources that belong to their own client.

- **`401 Unauthorized`**: Returned if the token is not provided or is invalid.
- **`404 Not Found`**: Returned when trying to access a resource that does not exist or does not belong to your client.

## Validation

Route parameters that expect an ID (e.g., `/api/properties/:id`) are validated to ensure they are a valid UUID. Sending an invalid ID format will result in a `400 Bad Request` error.

---

# Property Endpoints

**Base Path:** `/api/propriedades`

### 1. Create Property
- **Endpoint:** `POST /api/propriedades`
- **Description:** Creates a new property. The `clienteId` in the request body must be the same as the client associated with the authenticated user.
- **Input (Body):** `CreatePropriedadeDto` (JSON)
  ```json
  {
    "nome": "Good Hope Farm",
    "codigoInterno": "FBE-01",
    "clienteId": "uuid-of-the-logged-in-user-client",
    "codigoSicar": "CAR-12345-BR",
    "areaHectares": 350.75
  }
  ```
- **Output (Success 201):** Full `Propriedade` object (JSON), including the `geojson` field.
- **Outputs (Common Errors):**
    - `400 Bad Request`: Validation error on the sent data.
    - `401 Unauthorized`: The `clienteId` in the body does not match the authenticated user's client.
    - `409 Conflict`: If a property with the same `codigoInterno` or `codigoSicar` already exists.

### 2. List Properties
- **Endpoint:** `GET /api/propriedades`
- **Description:** Returns all properties of the client associated with the authenticated user.
- **Input:** None.
- **Output (Success 200):** Array of `Propriedade` objects (JSON), **without** the `geojson` field.
- **Outputs (Common Errors):**
    - `401 Unauthorized`: User not associated with a client.

### 3. Get Property Details
- **Endpoint:** `GET /api/propriedades/:id`
- **Description:** Returns the details of a single property by its ID.
- **Input (Route Parameter):** `id` (string, UUID)
- **Output (Success 200):** `Propriedade` object (JSON), including `geojson` and a `talhoes` array (without the plots' `geojson`).
- **Outputs (Common Errors):**
    - `400 Bad Request`: Invalid ID format.
    - `404 Not Found`: Property not found or does not belong to the user's client.

### 4. Update Property
- **Endpoint:** `PUT /api/propriedades/:id`
- **Description:** Updates an existing property.
- **Input (Body):** `UpdatePropriedadeDto` (JSON, partial fields)
- **Output (Success 200):** Updated `Propriedade` object (JSON).
- **Outputs (Common Errors):**
    - `400 Bad Request`: Invalid ID format or validation error on the data.
    - `404 Not Found`: Property not found or does not belong to the user's client.
    - `409 Conflict`: If the update results in a duplicate `codigoInterno` or `codigoSicar`.

### 5. Delete Property
- **Endpoint:** `DELETE /api/propriedades/:id`
- **Description:** Deletes a property by its ID.
- **Output (Success 204):** No content.
- **Outputs (Common Errors):**
    - `400 Bad Request`: Invalid ID format.
    - `404 Not Found`: Property not found or does not belong to the user's client.

### 6. List Plots of a Property
- **Endpoint:** `GET /api/propriedades/:propriedadeId/talhoes`
- **Description:** Returns all plots of a specific property.
- **Input (Route Parameter):** `propriedadeId` (string, UUID)
- **Output (Success 200):** Array of `Talhao` objects (JSON), **without** the `geojson` field.
- **Outputs (Common Errors):**
    - `400 Bad Request`: Invalid property ID format.
    - `404 Not Found`: Property not found or does not belong to the user's client.

---

# Plot Endpoints

**Base Path:** `/api/talhoes`

### 1. Create Plot
- **Endpoint:** `POST /api/talhoes`
- **Description:** Creates a new plot associated with a property.
- **Input (Body):** `CreateTalhaoDto` (JSON)
  ```json
  {
    "nome": "Plot Sector 5",
    "codigo": "TS-05",
    "propriedadeId": "uuid-of-the-property",
    "areaHectares": 25.5
  }
  ```
- **Output (Success 201):** Full `Talhao` object (JSON), including `geojson`.
- **Outputs (Common Errors):**
    - `400 Bad Request`: Validation error on the data.
    - `404 Not Found`: `propriedadeId` not found or does not belong to the user's client.
    - `409 Conflict`: If a plot with the same `codigo` already exists for the property.

### 2. List Plots
- **Endpoint:** `GET /api/talhoes`
- **Description:** Returns the plots of a specific property.
- **Input (Required Query Parameter):** `propriedadeId` (string, UUID)
- **Output (Success 200):** Array of `Talhao` objects (JSON), **without** the `geojson` field.
- **Outputs (Common Errors):**
    - `400 Bad Request`: `propriedadeId` not provided or has an invalid format.
    - `404 Not Found`: Property not found or does not belong to the user's client.

### 3. Get Plot Details
- **Endpoint:** `GET /api/talhoes/:id`
- **Description:** Returns the details of a single plot.
- **Input (Route Parameter):** `id` (string, UUID)
- **Output (Success 200):** `Talhao` object with all its data (JSON), **including** the `geojson` field.
- **Outputs (Common Errors):**
    - `400 Bad Request`: Invalid ID format.
    - `404 Not Found`: Plot not found or does not belong to the user's client.

### 4. Update Plot
- **Endpoint:** `PUT /api/talhoes/:id`
- **Description:** Updates an existing plot.
- **Input (Body):** `UpdateTalhaoDto` (JSON, partial fields)
- **Output (Success 200):** Updated `Talhao` object (JSON).
- **Outputs (Common Errors):**
    - `400 Bad Request`: Invalid ID format or validation error.
    - `404 Not Found`: Plot not found or does not belong to the user's client.
    - `409 Conflict`: If the update results in a duplicate `codigo` for the same property.

### 5. Delete Plot
- **Endpoint:** `DELETE /api/talhoes/:id`
- **Description:** Deletes a plot by its ID.
- **Output (Success 204):** No content.
- **Outputs (Common Errors):**
    - `400 Bad Request`: Invalid ID format.
    - `404 Not Found`: Plot not found or does not belong to the user's client.