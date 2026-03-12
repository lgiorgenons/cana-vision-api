# 📄 Atmos API - Gestão de Artefatos (Arquivos e Processados)

> **⚠️ Nota de Implementação (Março/2026):**  
> Os endpoints individuais (`/api/artefatos/:id`) agora aceitam tanto o **UUID técnico** quanto o **Identificador Semântico** (`propriedade-data-indice`).  
> O identificador semântico facilita o parse no Frontend e a organização de camadas no mapa.

---

## 1. Listar todos do Cliente (Geral)

### Endpoint: `/api/artefatos` (GET)

**Descrição:**  
Lista todos os artefatos vinculados ao cliente autenticado.

**Resposta de Sucesso (200 OK):**

```json
[
  {
    "id": "e9e0d9ef-ed04-429c-ae75-c1a3182ac6d2",
    "identificador": "8cc63dfa-20260308-RGB_TOTAL",
    "tipo": "geotiff",
    "indice": "RGB_TOTAL",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "url": "/api/artefatos/8cc63dfa-20260308-RGB_TOTAL/download",
    "talhao": null,
    "propriedade": { "nome": "Usina Moreno" }
  }
]
```

---

## 2. Listar por Propriedade

### Endpoint: `/api/artefatos/propriedade/:propriedadeId` (GET)

**Resposta de Sucesso (200 OK):**

```json
[
  {
    "id": "8d0663d1-f467-4bbe-8099-3e48184b67b7",
    "identificador": "8cc63dfa-20260308-NDVI_TOTAL",
    "url": "/api/artefatos/8cc63dfa-20260308-NDVI_TOTAL/download",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "talhao": null,
    "propriedade": { "nome": "Usina Moreno" }
  }
]
```

---

## 3. Buscar Individual (View)

### Endpoint: `/api/artefatos/:id` (GET)

**Descrição:**  
Retorna os metadados de um artefato buscando por UUID ou Identificador.

---

## 4. Download Direto (Proxy Stream)

### Endpoint: `/api/artefatos/:id/download` (GET)

**Descrição:**  
Download aceita UUID ou Identificador semântico.
