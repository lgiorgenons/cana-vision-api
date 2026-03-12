# 📄 Atmos API - Gestão de Artefatos (Arquivos e Processados)

> **⚠️ Nota de Implementação (Planejamento Março/2026):**  
> Os endpoints abaixo passarão a adotar o **Identificador Semântico** (`propriedade-data-indice`) como padrão para facilitar o parse no Frontend.  
> As URLs continuam sendo via **Proxy interno** (`/api/artefatos/:id/download`) por segurança.

---

## 1. Listar por Propriedade (Consumo Principal Mapa)

### Endpoint: `/api/artefatos/propriedade/:propriedadeId` (GET)

**Descrição:**  
Lista todos os artefatos (GeoTIFFs de NDVI, NDWI, etc.) vinculados a uma propriedade, incluindo processamentos globais da fazenda e processamentos por talhão. 

**Resposta de Sucesso (200 OK):**

```json
[
  {
    "id": "uuid-tecnico-unico",
    "identificador": "8cc63dfa-20260308-NDVI_TOTAL",
    "propriedadeId": "8cc63dfa-42c9-4b84-a950-72077b283435",
    "tipo": "geotiff",
    "indice": "NDVI_TOTAL",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "url": "/api/artefatos/uuid-tecnico-unico/download",
    "metadata": {
        "escala": "fazenda_completa",
        "sensor": "Sentinel-2"
    },
    "talhao": null,
    "propriedade": {
        "nome": "Usina Moreno"
    }
  },
  {
    "id": "uuid-tecnico-talhao",
    "identificador": "8cc63dfa-20260308-NDVI_T01",
    "propriedadeId": "8cc63dfa-42c9-4b84-a950-72077b283435",
    "talhaoId": "uuid-talhao-01",
    "tipo": "geotiff",
    "indice": "NDVI",
    "dataReferencia": "2026-03-08T00:00:00.000Z",
    "url": "/api/artefatos/uuid-tecnico-talhao/download",
    "talhao": {
        "nome": "Talhão 01",
        "codigo": "T01"
    },
    "propriedade": {
        "nome": "Usina Moreno"
    }
  }
]
```

---

## 2. Buscar Individual (View)

### Endpoint: `/api/artefatos/:id` (GET)

**Descrição:**  
Retorna os metadados completos de um único artefato, incluindo o identificador semântico para parse.

**Resposta de Sucesso (200 OK):**

```json
{
  "id": "uuid-tecnico",
  "identificador": "8cc63dfa-20260308-NDVI_TOTAL",
  "tipo": "geotiff",
  "indice": "NDVI_TOTAL",
  "dataReferencia": "2026-03-08T00:00:00.000Z",
  "url": "/api/artefatos/uuid-tecnico/download",
  "caminho": "sentinel2/fazenda_toda_ndvi.tif",
  "metadata": {
    "sensor": "Sentinel-2",
    "nuvens": 0.05
  }
}
```

---

## 3. Download Direto (Proxy Stream)

### Endpoint: `/api/artefatos/:id/download` (GET)

**Descrição:**  
Entrega os bytes do arquivo diretamente (Stream).

---
**Campos Adicionados:**
- `identificador`: String para parse (Propriedade-Data-Índice).
- `dataReferencia`: Data real da imagem (Sincronizada com satélite).
