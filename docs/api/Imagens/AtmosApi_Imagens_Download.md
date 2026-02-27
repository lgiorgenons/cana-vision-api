# 📄 Atmos API - Download e Visualização de Imagens (GeoTIFF)

| Status | Versão | Responsável | Última Atualização |
| :--- | :--- | :--- | :--- |
| **[DRAFT]** | v1.0.0 | AtmosAgro Dev Team | 25/02/2026 |

## 🎯 Objetivo
Documentar os endpoints responsáveis pela entrega final dos produtos cartográficos (GeoTIFFs) gerados pelo core de processamento. Estes endpoints garantem que o usuário final receba apenas os dados autorizados para o seu `clienteId`.

---

## 🔐 Segurança e Autenticação
*   **Auth**: Requer `Bearer Token` (Supabase).
*   **RBAC**: O usuário deve ter permissão de leitura sobre a `Propriedade` vinculada ao `Talhão` que gerou o artefato.
*   **GCS Access**: A API atua como um proxy seguro, gerando **Signed URLs** temporárias (V4) com expiração de 15 minutos.

---

## 1. Download Direto (Redirect)
Faz o redirecionamento imediato para o arquivo no Google Cloud Storage. Ideal para botões de "Download" no Dashboard.

### `GET /api/imagens/:id/download`

#### **Parâmetros de Path**
| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Sim | Identificador único do **Artefato** no banco de dados. |

#### **Parâmetros de Query**
| Parâmetro | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `disposition` | string | `attachment` | `attachment` (força download) ou `inline` (tenta abrir no navegador). |

#### **Resposta de Sucesso**
*   **Código:** `302 Found`
*   **Header:** `Location: https://storage.googleapis.com/... (URL ASSINADA)`

---

## 2. Metadados e URL de Visualização
Retorna um JSON com os dados do arquivo e a URL para ser consumida por bibliotecas de mapa (Ex: Leaflet + georaster-layer-for-leaflet).

### `GET /api/imagens/:id/view`

#### **Parâmetros de Path**
| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Sim | Identificador único do **Artefato**. |

#### **Exemplo de Resposta de Sucesso**
*   **Código:** `200 OK`

```json
{
  "id": "990e8400-e29b-41d4-a716-446655449999",
  "nome": "2025-12-29_NDVI.tif",
  "tipo": "geotiff",
  "indice": "NDVI",
  "tamanhoBytes": 15728640,
  "url": "https://storage.googleapis.com/atmos-agro-data-lake-dev/processed/550e/2025-12-29_NDVI.tif?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=...",
  "expiresAt": "2025-02-25T22:30:00Z",
  "metadata": {
    "data_imagem": "2025-12-29",
    "cloud_cover": 0.05,
    "sensor": "Sentinel-2"
  }
}
```

---

## ⚠️ Tratamento de Erros

| Código HTTP | Mensagem (Exemplo) | Causa |
| :--- | :--- | :--- |
| **400** | `ID da imagem inválido` | O formato do UUID passado no path está incorreto. |
| **401** | `Sessão expirada` | Token JWT ausente ou inválido. |
| **403** | `Acesso negado` | O artefato pertence a outro cliente ou o usuário não tem permissão. |
| **404** | `Imagem não encontrada` | O registro não existe no banco ou o arquivo foi deletado do GCS. |
| **500** | `Erro ao gerar link seguro` | Falha na comunicação com o Google Cloud Storage. |

---

## 📝 Notas para o Frontend
1.  As URLs geradas expiram em **15 minutos**. Não armazene estas URLs no estado global por longos períodos.
2.  Para renderização no Leaflet, utilize o endpoint `/view` para obter a URL e passe-a para o `georaster`.
3.  O campo `tamanhoBytes` pode ser usado para exibir uma barra de progresso ou aviso de arquivos grandes.
