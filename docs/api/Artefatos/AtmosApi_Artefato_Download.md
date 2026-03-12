# Endpoint: /api/artefatos/:id/download (GET)

## Descrição:
Entrega os bytes do arquivo diretamente. Este endpoint é flexível e aceita tanto o **UUID técnico** quanto o **Identificador Semântico** na URL de download.

## Método:
`GET`

## Parâmetros de Requisição:
### Path Params:
- `id` (string, UUID ou Identificador, Obrigatório): 
    - Exemplo UUID: `/api/artefatos/e9e0d9ef-.../download`
    - Exemplo Identificador: `/api/artefatos/8cc63dfa-20260308-RGB_TOTAL/download`

## Resposta de Sucesso:
### Exemplo de Sucesso:
**Requisição:**
`GET /api/artefatos/8cc63dfa-20260308-RGB_TOTAL/download`

**Resposta:**
- **Status:** `200 OK`
- **Headers:** 
    - `Content-Type`: `image/tiff`
    - `Content-Disposition`: `attachment; filename="usina_moreno_rgb_20260308.tif"`
- **Corpo:** Stream binário do arquivo.

---

## Respostas de Erro:

### 404 Not Found:
ID ou Identificador não encontrado.

### 403 Forbidden:
O usuário não tem permissão para acessar este arquivo.
