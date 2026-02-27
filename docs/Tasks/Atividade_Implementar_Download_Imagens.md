# 📋 Atividade: Implementação de Endpoints para Download e View de GeoTIFFs

| ID | Status | Prioridade | Responsável |
| :--- | :--- | :--- | :--- |
| TASK-005 | 🟢 PLANEJAMENTO | ALTA | Gemini CLI / Lucas |

## 1. Objetivo
Disponibilizar endpoints seguros na API Node.js para que o Frontend possa baixar arquivos GeoTIFF diretamente do Google Cloud Storage (GCS) e visualizar camadas de mapas via URLs assinadas, garantindo que usuários de diferentes clientes não acessem dados uns dos outros.

---

## 2. Requisitos Técnicos
- **Segurança (Tenancy):** O `clienteId` vinculado ao usuário logado deve ser validado contra o `clienteId` da `Propriedade` associada ao `Artefato`.
- **Integridade:** Verificar se o arquivo realmente existe no GCS antes de gerar a URL (uso do `storageClient.exists`).
- **Performance:** As URLs devem ter expiração curta (15 minutos) para evitar vazamento de links permanentes.
- **Redirecionamento:** O endpoint de download deve retornar status `302` para integração direta com links HTML.

---

## 3. Checklist de Implementação (Passo a Passo)

### 🟢 Fase 1: Camada de Dados (Repository)
- [x] No `ArtefatosRepository`, criar método `findById` (com inclusão de hierarquia).
- [x] O método retorna o `Artefato` incluindo `talhao -> propriedade -> clienteId`.

### 🟡 Fase 2: Lógica de Negócio (Service)
- [x] No `ArtefatosService`, implementado `getSignedUrl(id, authClienteId)`.
- [x] Implementada validação de Tenancy: Se `artefato.clienteId !== authClienteId`, lança Erro 403.
- [x] Integrado com `StorageClient` para gerar a Signed URL (V4).

### 🔵 Fase 3: Interface (Controller & Routes)
- [x] No `ArtefatosController`, implementados `getById` (JSON) e `download` (Redirect 302).
- [x] Em `src/api/routes/artefatos/artefatos.routes.ts`, registradas as rotas `GET /:id` e `GET /:id/download`.

### 🔴 Fase 4: Validação (Testes)
- [ ] Criar script de teste (ou teste unitário) que:
    1. Tenta baixar um artefato existente com o cliente correto (Sucesso).
    2. Tenta baixar um artefato de outro cliente (Erro 403).
    3. Tenta baixar um ID inexistente (Erro 404).

---

## 4. Definição de Pronto (DoD)
- [ ] Código compilando sem erros de TypeScript.
- [ ] Endpoints respondendo conforme a documentação em `docs/api/Imagens/AtmosApi_Imagens_Download.md`.
- [ ] Nenhuma credencial do GCS exposta no frontend (apenas a URL assinada).
- [ ] Documentação técnica no Confluence atualizada (se necessário).

---

## 5. Riscos Identificados
- **CORS:** O bucket do GCS precisa estar configurado para permitir requisições do domínio do frontend para visualização `inline`.
- **Latency:** A geração da Signed URL via SDK do Google é rápida, mas requer credenciais gcloud ativas no ambiente de execução.
