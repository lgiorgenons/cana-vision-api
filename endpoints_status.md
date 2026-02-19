# Endpoint Status Report - CanaVision API

Este documento detalha o estado atual dos endpoints da API, sua implementação, documentação e possíveis retornos.

## 1. Endpoints Implementados e Registrados

### 1.1. Autenticação (`/api/auth`)
| Endpoint | Método | Descrição | Status Imp. | Status Doc. |
| :--- | :---: | :--- | :---: | :---: |
| `/auth/register` | `POST` | Registro de novo usuário | ✅ Sim | ✅ Sim |
| `/auth/login` | `POST` | Login e geração de tokens | ✅ Sim | ✅ Sim |
| `/auth/forgot-password` | `POST` | Solicitação de reset de senha | ✅ Sim | ✅ Sim |
| `/auth/reset-password` | `POST` | Redefinição de senha com token | ✅ Sim | ✅ Sim |
| `/auth/refresh-token` | `POST` | Renovação do Access Token | ✅ Sim | ✅ Sim |
| `/auth/logout` | `POST` | Encerramento de sessão | ✅ Sim | ✅ Sim |

**Retornos Possíveis:**
- `200 OK`: Operação realizada com sucesso.
- `201 Created`: Usuário criado (no register).
- `400 Bad Request`: Erro de validação ou payload inválido.
- `401 Unauthorized`: Credenciais inválidas ou token expirado.
- `409 Conflict`: E-mail já cadastrado.

---

### 1.2. Propriedades (`/api/propriedades`)
| Endpoint | Método | Descrição | Status Imp. | Status Doc. |
| :--- | :---: | :--- | :---: | :---: |
| `/propriedades` | `POST` | Criar nova propriedade | ✅ Sim | ⚠️ Pendente |
| `/propriedades` | `GET` | Listar propriedades do cliente | ✅ Sim | ⚠️ Pendente |
| `/propriedades/:id` | `GET` | Detalhar uma propriedade | ✅ Sim | ⚠️ Pendente |
| `/propriedades/:id` | `PUT` | Atualizar dados da propriedade | ✅ Sim | ⚠️ Pendente |
| `/propriedades/:id` | `DELETE` | Remover uma propriedade | ✅ Sim | ⚠️ Pendente |
| `/propriedades/:propriedadeId/talhoes` | `GET` | Listar talhões de uma propriedade | ✅ Sim | ⚠️ Pendente |

**Retornos Possíveis:**
- `200 OK`: Sucesso na consulta ou atualização.
- `201 Created`: Propriedade criada.
- `204 No Content`: Removido com sucesso.
- `400 Bad Request`: Erro de validação (Zod).
- `401 Unauthorized`: Não autenticado ou sem cliente associado.
- `404 Not Found`: Propriedade não encontrada.

---

### 1.3. Talhões (`/api/talhoes`)
| Endpoint | Método | Descrição | Status Imp. | Status Doc. |
| :--- | :---: | :--- | :---: | :---: |
| `/talhoes` | `POST` | Criar novo talhão | ✅ Sim | ⚠️ Pendente |
| `/talhoes` | `GET` | Listar todos os talhões do cliente | ✅ Sim | ⚠️ Pendente |
| `/talhoes/:id` | `GET` | Detalhar um talhão | ✅ Sim | ⚠️ Pendente |
| `/talhoes/:id` | `PUT` | Atualizar dados do talhão | ✅ Sim | ⚠️ Pendente |
| `/talhoes/:id` | `DELETE` | Remover um talhão | ✅ Sim | ⚠️ Pendente |

**Retornos Possíveis:**
- `200 OK`, `201 Created`, `204 No Content`, `400`, `401`, `404`.

---

### 1.4. Saúde (`/api/health`)
| Endpoint | Método | Descrição | Status Imp. | Status Doc. |
| :--- | :---: | :--- | :---: | :---: |
| `/health` | `GET` | Verifica saúde do serviço | ✅ Sim | ✅ Sim |

**Retorno:** `200 OK` -> `{ "status": "ok" }`.

---

## 2. Endpoints em Desenvolvimento (Planned)

| Domínio | Endpoint Base | Status | Observação |
| :--- | :--- | :---: | :--- |
| **Jobs** | `/api/jobs` | 🛠️ In Progress | Orquestração do Core (Python) |
| **Alertas** | `/api/alertas` | ⏳ To Do | Notificações e anomalias |
| **Clientes** | `/api/clientes` | ⏳ To Do | Gestão administrativa de clientes |
| **Usuários** | `/api/usuarios` | ⏳ To Do | Gestão de perfil e permissões |
| **SICAR** | `/api/sicar` | ⏳ To Do | Integração com dados do CAR |
| **Artefatos** | `/api/artefatos` | ⏳ To Do | Gestão de arquivos no GCS |

---

## 3. Resumo de Cobertura
- **Funcionalidade Central (CRUD Geo):** 80% implementado.
- **Autenticação:** 100% implementado.
- **Documentação Detalhada:** 40% concluída (Foco em Auth).
- **Integração com Core:** Pendente definição de rotas em `/jobs`.
