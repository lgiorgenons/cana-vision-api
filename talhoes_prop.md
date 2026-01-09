# Documentação dos Endpoints - Propriedades e Talhões

## Autenticação

Todos os endpoints descritos abaixo são protegidos e requerem um token de autenticação válido (JWT) no cabeçalho `Authorization`.

---

# Endpoints de Propriedades

**Caminho Base:** `/api/propriedades`

### 1. Criar Propriedade
*   **Endpoint:** `POST /api/propriedades`
*   **Descrição:** Cria uma nova propriedade.
*   **Input (Body):** `CreatePropriedadeDto` (JSON)
    ```json
    
    {
      client_uuid:"uuid"
      info_client:[iNFORMAçõe]
      property: [
        {"nome": "Fazenda Boa Esperança",
        "codigoInterno": "FBE-01",
        "clienteId": "uuid-do-cliente",
        "codigoSicar": "CAR-12345-BR",
        "geojson": {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [ -48.0, -16.0 ],
                [ -47.0, -16.0 ],
                [ -47.0, -15.0 ],
                [ -48.0, -15.0 ],
                [ -48.0, -16.0 ]
              ]
            ]
          },
          "properties": {
            "area": 123.45
          }
        },
        "areaHectares": 350.75,
        "culturaPrincipal": "Cana-de-açúcar",
        "safraAtual": "2024/2025",
        "metadata": {}
      },      
      info:
        {"nome": "Fazenda Boa Esperança",
        "codigoInterno": "FBE-01",
        "clienteId": "uuid-do-cliente",
        "codigoSicar": "CAR-12345-BR",
        "geojson": {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [ -48.0, -16.0 ],
                [ -47.0, -16.0 ],
                [ -47.0, -15.0 ],
                [ -48.0, -15.0 ],
                [ -48.0, -16.0 ]
              ]
            ]
          },
          "properties": {
            "area": 123.45
          }
        },
        "areaHectares": 350.75,
        "culturaPrincipal": "Cana-de-açúcar",
        "safraAtual": "2024/2025",
        "metadata": {}
      }
      ]
    }
    ```
*   **Retorno (Sucesso 201):** Objeto `Propriedade` (JSON), incluindo o campo `geojson`.

### 2. Listar Propriedades
*   **Endpoint:** `GET /api/propriedades`
*   **Descrição:** Retorna todas as propriedades de um cliente específico.
*   **Input (Query Parameter):** `clienteId` (string, UUID) - Ex: `/api/propriedades?clienteId=uuid-do-cliente`
*   **Retorno (Sucesso 200):** Array de objetos `Propriedade` (JSON), **sem** o campo `geojson` para maior performance.

### 3. Obter Detalhes da Propriedade
*   **Endpoint:** `GET /api/propriedades/:id`
*   **Descrição:** Retorna os detalhes de uma única propriedade pelo seu ID.
*   **Input (Parâmetro de Rota):** `id` (string, UUID) - Ex: `/api/propriedades/uuid-da-propriedade`
*   **Retorno (Sucesso 200):** Objeto `Propriedade` (JSON), incluindo o campo `geojson` e um array `talhoes` com os talhões associados (sem o `geojson` de cada talhão).

### 4. Atualizar Propriedade
*   **Endpoint:** `PUT /api/propriedades/:id`
*   **Descrição:** Atualiza uma propriedade existente.
*   **Input (Body):** `UpdatePropriedadeDto` (JSON, com campos parciais)
    ```json
    {
      "nome": "Fazenda Nova Esperança",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [ -49.0, -17.0 ],
              [ -48.0, -17.0 ],
              [ -48.0, -16.0 ],
              [ -49.0, -16.0 ],
              [ -49.0, -17.0 ]
            ]
          ]
        },
        "properties": {
          "area": 150.00
        }
      }
    }
    ```
*   **Retorno (Sucesso 200):** Objeto `Propriedade` atualizado (JSON), incluindo o campo `geojson`.

### 5. Deletar Propriedade
*   **Endpoint:** `DELETE /api/propriedades/:id`
*   **Descrição:** Deleta uma propriedade pelo seu ID.
*   **Retorno (Sucesso 204):** Sem conteúdo.

### 6. Listar Talhões de uma Propriedade
*   **Endpoint:** `GET /api/propriedades/:propriedadeId/talhoes`
*   **Descrição:** Retorna todos os talhões associados a uma propriedade específica.
*   **Input (Parâmetro de Rota):** `propriedadeId` (string, UUID) - Ex: `/api/propriedades/uuid-da-propriedade/talhoes`
*   **Retorno (Sucesso 200):** Array de objetos `Talhao` (JSON), **sem** o campo `geojson`.

---

# Endpoints de Talhões

**Caminho Base:** `/api/talhoes`

### 1. Criar Talhão
*   **Endpoint:** `POST /api/talhoes`
*   **Descrição:** Cria um novo talhão.
*   **Input (Body):** `CreateTalhaoDto` (JSON)
    ```json
    {
      "nome": "Talhão Setor 5",
      "codigo": "TS-05",
      "propriedadeId": "uuid-da-propriedade",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [ -47.5, -15.5 ],
              [ -47.2, -15.5 ],
              [ -47.2, -15.2 ],
              [ -47.5, -15.2 ],
              [ -47.5, -15.5 ]
            ]
          ]
        },
        "properties": {
          "area": 25.5
        }
      },
      "areaHectares": 25.5,
      "cultura": "Cana-de-açúcar",
      "safra": "2024/2025",
      "variedade": "RB966928",
      "metadata": {}
    }
    ```
*   **Retorno (Sucesso 201):** Objeto `Talhao` (JSON), incluindo o campo `geojson`.

### 2. Listar Talhões
*   **Endpoint:** `GET /api/talhoes`
*   **Descrição:** Retorna todos os talhões. Pode ser filtrado por `propriedadeId` via query parameter.
*   **Input (Query Parameter Opcional):** `propriedadeId` (string, UUID)
*   **Retorno (Sucesso 200):** Array de objetos `Talhao` (JSON), **sem** o campo `geojson`.

### 3. Obter Detalhes do Talhão (Info Talhão)
*   **Endpoint:** `GET /api/talhoes/:id`
*   **Descrição:** **Este endpoint retorna todas as informações de um único talhão.**
*   **Input (Parâmetro de Rota):** `id` (string, UUID) - Ex: `/api/talhoes/uuid-do-talhao`
*   **Retorno (Sucesso 200):** Objeto `Talhao` com todos os seus dados (JSON), **incluindo** o campo `geojson`.

### 4. Atualizar Talhão
*   **Endpoint:** `PUT /api/talhoes/:id`
*   **Descrição:** Atualiza um talhão existente.
*   **Input (Body):** `UpdateTalhaoDto` (JSON, com campos parciais)
    ```json
    {
      "variedade": "CTC9001",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [ -47.6, -15.6 ],
              [ -47.3, -15.6 ],
              [ -47.3, -15.3 ],
              [ -47.6, -15.3 ],
              [ -47.6, -15.6 ]
            ]
          ]
        },
        "properties": {
          "area": 26.0
        }
      }
    }
    ```
*   **Retorno (Sucesso 200):** Objeto `Talhao` atualizado (JSON), incluindo o campo `geojson`.

### 5. Deletar Talhão
*   **Endpoint:** `DELETE /api/talhoes/:id`
*   **Descrição:** Deleta um talhão pelo seu ID.
*   **Retorno (Sucesso 204):** Sem conteúdo.

---

# API Documentation - Properties and Plots

## Authentication

All endpoints described below are protected and require a valid authentication token (JWT) in the `Authorization` header.

---

# Property Endpoints

**Base Path:** `/api/propriedades`

### 1. Create Property
*   **Endpoint:** `POST /api/propriedades`
*   **Description:** Creates a new property.
*   **Input (Body):** `CreatePropriedadeDto` (JSON)
    ```json
    {
      "nome": "Good Hope Farm",
      "codigoInterno": "FBE-01",
      "clienteId": "client-uuid",
      "codigoSicar": "CAR-12345-BR",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [ -48.0, -16.0 ],
              [ -47.0, -16.0 ],
              [ -47.0, -15.0 ],
              [ -48.0, -15.0 ],
              [ -48.0, -16.0 ]
            ]
          ]
        },
        "properties": {
          "area": 123.45
        }
      },
      "areaHectares": 350.75,
      "culturaPrincipal": "Sugarcane",
      "safraAtual": "2024/2025",
      "metadata": {}
    }
    ```
*   **Output (Success 201):** `Propriedade` object (JSON), including the `geojson` field.

### 2. List Properties
*   **Endpoint:** `GET /api/propriedades`
*   **Description:** Returns all properties for a specific client.
*   **Input (Query Parameter):** `clienteId` (string, UUID) - e.g., `/api/propriedades?clienteId=client-uuid`
*   **Output (Success 200):** Array of `Propriedade` objects (JSON), **without** the `geojson` field for performance.

### 3. Get Property Details
*   **Endpoint:** `GET /api/propriedades/:id`
*   **Description:** Returns the details of a single property by its ID.
*   **Input (Route Parameter):** `id` (string, UUID) - e.g., `/api/propriedades/property-uuid`
*   **Output (Success 200):** `Propriedade` object (JSON), including the `geojson` field and a `talhoes` array with the associated plots (without their `geojson`).

### 4. Update Property
*   **Endpoint:** `PUT /api/propriedades/:id`
*   **Description:** Updates an existing property.
*   **Input (Body):** `UpdatePropriedadeDto` (JSON, with partial fields)
    ```json
    {
      "nome": "New Hope Farm",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [ -49.0, -17.0 ],
              [ -48.0, -17.0 ],
              [ -48.0, -16.0 ],
              [ -49.0, -16.0 ],
              [ -49.0, -17.0 ]
            ]
          ]
        },
        "properties": {
          "area": 150.00
        }
      }
    }
    ```
*   **Output (Success 200):** Updated `Propriedade` object (JSON), including the `geojson` field.

### 5. Delete Property
*   **Endpoint:** `DELETE /api/propriedades/:id`
*   **Description:** Deletes a property by its ID.
*   **Output (Success 204):** No Content.

### 6. List Plots of a Property
*   **Endpoint:** `GET /api/propriedades/:propriedadeId/talhoes`
*   **Description:** Returns all plots associated with a specific property.
*   **Input (Route Parameter):** `propriedadeId` (string, UUID) - e.g., `/api/propriedades/property-uuid/talhoes`
*   **Output (Success 200):** Array of `Talhao` objects (JSON), **without** the `geojson` field.

---

# Plot Endpoints

**Base Path:** `/api/talhoes`

### 1. Create Plot
*   **Endpoint:** `POST /api/talhoes`
*   **Description:** Creates a new plot.
*   **Input (Body):** `CreateTalhaoDto` (JSON)
    ```json
    {
      "nome": "Plot Sector 5",
      "codigo": "TS-05",
      "propriedadeId": "property-uuid",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [ -47.5, -15.5 ],
              [ -47.2, -15.5 ],
              [ -47.2, -15.2 ],
              [ -47.5, -15.2 ],
              [ -47.5, -15.5 ]
            ]
          ]
        },
        "properties": {
          "area": 25.5
        }
      },
      "areaHectares": 25.5,
      "cultura": "Sugarcane",
      "safra": "2024/2025",
      "variedade": "RB966928",
      "metadata": {}
    }
    ```
*   **Output (Success 201):** `Talhao` object (JSON), including the `geojson` field.

### 2. List Plots
*   **Endpoint:** `GET /api/talhoes`
*   **Description:** Returns all plots. Can be filtered by `propriedadeId` via query parameter.
*   **Input (Optional Query Parameter):** `propriedadeId` (string, UUID)
*   **Output (Success 200):** Array of `Talhao` objects (JSON), **without** the `geojson` field.

### 3. Get Plot Details (Plot Info)
*   **Endpoint:** `GET /api/talhoes/:id`
*   **Description:** **This endpoint returns all information for a single plot.**
*   **Input (Route Parameter):** `id` (string, UUID) - e.g., `/api/talhoes/plot-uuid`
*   **Output (Success 200):** `Talhao` object with all its data (JSON), **including** the `geojson` field.

### 4. Update Plot
*   **Endpoint:** `PUT /api/talhoes/:id`
*   **Description:** Updates an existing plot.
*   **Input (Body):** `UpdateTalhaoDto` (JSON, with partial fields)
    ```json
    {
      "variedade": "CTC9001",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [ -47.6, -15.6 ],
              [ -47.3, -15.6 ],
              [ -47.3, -15.3 ],
              [ -47.6, -15.3 ],
              [ -47.6, -15.6 ]
            ]
          ]
        },
        "properties": {
          "area": 26.0
        }
      }
    }
    ```
*   **Output (Success 200):** Updated `Talhao` object (JSON), including the `geojson` field.

### 5. Delete Plot
*   **Endpoint:** `DELETE /api/talhoes/:id`
*   **Description:** Deletes a plot by its ID.
*   **Output (Success 204):** No Content.