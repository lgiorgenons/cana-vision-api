# Estrutura de Documentação - CanaVision (Lean)

Este documento define a organização essencial para manter o alinhamento técnico e de negócio entre os fundadores.

## 1. Central de Decisões (Home)
*   **Visão do Produto**: O que estamos resolvendo e para quem.
*   **Acessos Rápidos**: Links para GCP Console, Supabase, Vercel e Repositórios.

## 2. Produto & Roadmap
*   **MVP Scope**: O que entra e o que NÃO entra na primeira versão.
*   **Roadmap 2026**: Milestones mensais (ex: "Janeiro: Integração NDWI").
*   **Notas de Sync**: Decisões rápidas tomadas em reuniões.

## 3. Arquitetura do Sistema
*   **Fluxo de Dados (Eco-Diagrama)**: Como Core, API e Front se comunicam.
*   **Modelo de Dados (Single Source of Truth)**:
    *   Esquema do Banco (Prisma) simplificado.
    *   Estrutura de pastas do GCS (Buckets e Ciclo de Vida).

## 4. Conhecimento Técnico Especializado
### 4.1. Core (Python ETL)
*   **Lógica dos Índices**: A matemática por trás do NDVI, NDWI e filtros de nuvens.
*   **Guia de Processamento**: Como rodar/testar o pipeline localmente.

### 4.2. API & Integrações
*   **Contratos de API**: Endpoints principais e o que eles retornam.
*   **Auth & Permissões**: Como os níveis de acesso (Admin/Cliente) funcionam.

### 4.3. Front-End (GIS & UI)
*   **Padrões de Mapa**: Como os GeoTIFFs são renderizados (Leaflet/Georaster).

## 5. Operações & Infra
*   **Variáveis de Ambiente**: Onde encontrar e como configurar (sem expor segredos).
*   **Processo de Deploy**: Como colocar o Core e a API no ar.

## 6. Glossário
*   Termos técnicos de cana-de-açúcar e GIS para garantir que todos falem a mesma língua.
