# Endpoint: /api/artefatos/:id/download (GET)

## Descrição:
Entrega os bytes do arquivo diretamente para o cliente através de um proxy seguro. O link original do Google Cloud Storage nunca é exposto ao frontend, garantindo que o acesso seja mediado pela autenticação da API.

## Método:
`GET`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID, Obrigatório): ID único do artefato.

### Body:
Nenhum.

## Resposta de Sucesso:
### Exemplo de Sucesso:
**Requisição:**
`GET /api/artefatos/e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2/download`

**Resposta:**
- **Status:** `200 OK`
- **Headers:**
    - `Content-Type`: `image/tiff` (ou conforme o tipo do arquivo).
    - `Content-Disposition`: `attachment; filename="usina_moreno_ndvi_20260308.tif"`.
- **Corpo:** Fluxo binário (Stream) com o conteúdo do arquivo.

---

## Respostas de Erro:

### 401 Unauthorized:
Usuário não autenticado ou sessão expirada.

### 403 Forbidden:
O usuário pertence a um cliente diferente do dono do artefato.

### 404 Not Found:
Artefato não encontrado ou arquivo removido do storage.

### 500 Internal Server Error:
Falha na comunicação com o Google Cloud Storage ou erro ao ler o stream do arquivo.
