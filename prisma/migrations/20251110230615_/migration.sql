CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "tipo_documento_enum" AS ENUM ('CPF', 'CNPJ');

-- CreateEnum
CREATE TYPE "cliente_status_enum" AS ENUM ('ativo', 'suspenso', 'inativo');

-- CreateEnum
CREATE TYPE "usuario_status_enum" AS ENUM ('ativo', 'bloqueado', 'pendente');

-- CreateEnum
CREATE TYPE "talhao_status_enum" AS ENUM ('ativo', 'inativo');

-- CreateEnum
CREATE TYPE "job_status_enum" AS ENUM ('pending', 'running', 'succeeded', 'failed', 'canceled');

-- CreateEnum
CREATE TYPE "artefato_tipo_enum" AS ENUM ('html', 'geotiff', 'csv', 'png', 'json');

-- CreateEnum
CREATE TYPE "consulta_status_enum" AS ENUM ('pending', 'success', 'error');

-- CreateEnum
CREATE TYPE "auditoria_acao_enum" AS ENUM ('insert', 'update', 'delete', 'login', 'logout');

-- CreateTable
CREATE TABLE "roles" (
    "codigo" VARCHAR(40) NOT NULL,
    "descricao" VARCHAR(200),
    "nivel" SMALLINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nome" VARCHAR(200) NOT NULL,
    "documento" VARCHAR(20) NOT NULL,
    "tipo_documento" "tipo_documento_enum" NOT NULL,
    "email_contato" VARCHAR(200),
    "telefone_contato" VARCHAR(30),
    "responsavel" VARCHAR(200),
    "status" "cliente_status_enum" DEFAULT 'ativo',
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cliente_id" UUID,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "hash_senha" VARCHAR(200) NOT NULL,
    "role" VARCHAR(40),
    "status" "usuario_status_enum" DEFAULT 'ativo',
    "ultimo_login" TIMESTAMPTZ(6),
    "tfa_secret" VARCHAR(64),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "reset_token_hash" VARCHAR(200),
    "reset_token_expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(80) NOT NULL,
    "descricao" VARCHAR(200),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_permissoes" (
    "usuario_id" UUID NOT NULL,
    "permissao_id" INTEGER NOT NULL,
    "concedido_por" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_permissoes_pkey" PRIMARY KEY ("usuario_id","permissao_id")
);

-- CreateTable
CREATE TABLE "propriedades" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cliente_id" UUID,
    "nome" VARCHAR(200) NOT NULL,
    "codigo_interno" VARCHAR(60) NOT NULL,
    "codigo_sicar" VARCHAR(60),
    "geom" geometry,
    "geojson" JSONB,
    "area_hectares" DECIMAL(12,2),
    "cultura_principal" VARCHAR(100),
    "safra_atual" VARCHAR(20),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "propriedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talhoes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "propriedade_id" UUID,
    "codigo" VARCHAR(60) NOT NULL,
    "nome" VARCHAR(120),
    "geom" geometry,
    "geojson" JSONB,
    "area_hectares" DECIMAL(12,2),
    "variedade" VARCHAR(80),
    "safra" VARCHAR(20),
    "status" "talhao_status_enum" DEFAULT 'ativo',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talhoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cliente_id" UUID,
    "propriedade_id" UUID,
    "talhao_id" UUID,
    "iniciado_por" UUID,
    "pipeline" VARCHAR(80) NOT NULL,
    "status" "job_status_enum" NOT NULL,
    "parametros" JSONB NOT NULL,
    "resultado_dir" VARCHAR(255),
    "erro_mensagem" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "iniciado_em" TIMESTAMPTZ(6),
    "finalizado_em" TIMESTAMPTZ(6),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artefatos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "job_id" UUID,
    "talhao_id" UUID,
    "tipo" "artefato_tipo_enum" NOT NULL,
    "formato" VARCHAR(40),
    "indice" VARCHAR(40),
    "caminho" VARCHAR(255) NOT NULL,
    "checksum" VARCHAR(64),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "gerado_em" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artefatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "talhao_id" UUID,
    "job_id" UUID,
    "responsavel_id" UUID,
    "tipo" VARCHAR(80) NOT NULL,
    "severidade" VARCHAR(40),
    "status" VARCHAR(40),
    "titulo" VARCHAR(150),
    "mensagem" TEXT,
    "payload" JSONB NOT NULL,
    "gerado_em" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "resolvido_em" TIMESTAMPTZ(6),

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerta_severidades" (
    "codigo" VARCHAR(40) NOT NULL,
    "cor" VARCHAR(20),
    "prioridade" SMALLINT,
    "descricao" VARCHAR(200),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerta_severidades_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "alerta_status" (
    "codigo" VARCHAR(40) NOT NULL,
    "ordem" SMALLINT,
    "descricao" VARCHAR(200),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerta_status_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "consultas_sicar" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cliente_id" UUID,
    "propriedade_id" UUID,
    "codigo_car" VARCHAR(60),
    "parametros" JSONB NOT NULL,
    "resposta" JSONB,
    "status" "consulta_status_enum" NOT NULL,
    "mensagem_erro" TEXT,
    "executado_em" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultas_sicar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" BIGSERIAL NOT NULL,
    "tabela" VARCHAR(80) NOT NULL,
    "registro_id" UUID NOT NULL,
    "acao" "auditoria_acao_enum" NOT NULL,
    "dados_antes" JSONB,
    "dados_depois" JSONB,
    "usuario_id" UUID,
    "ip_origem" INET,
    "criado_em" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_documento_key" ON "clientes"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_codigo_key" ON "permissoes"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "propriedades_codigo_sicar_key" ON "propriedades"("codigo_sicar");

-- CreateIndex
CREATE INDEX "propriedades_geom_gix" ON "propriedades" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "propriedades_cliente_id_codigo_interno_key" ON "propriedades"("cliente_id", "codigo_interno");

-- CreateIndex
CREATE INDEX "talhoes_geom_gix" ON "talhoes" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "talhoes_propriedade_id_codigo_key" ON "talhoes"("propriedade_id", "codigo");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "artefatos_job_id_caminho_key" ON "artefatos"("job_id", "caminho");

-- CreateIndex
CREATE INDEX "alertas_status_idx" ON "alertas"("status");

-- CreateIndex
CREATE UNIQUE INDEX "consultas_sicar_propriedade_id_codigo_car_key" ON "consultas_sicar"("propriedade_id", "codigo_car");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_role_fkey" FOREIGN KEY ("role") REFERENCES "roles"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_permissoes" ADD CONSTRAINT "usuario_permissoes_concedido_por_fkey" FOREIGN KEY ("concedido_por") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_permissoes" ADD CONSTRAINT "usuario_permissoes_permissao_id_fkey" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_permissoes" ADD CONSTRAINT "usuario_permissoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "propriedades" ADD CONSTRAINT "propriedades_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "talhoes" ADD CONSTRAINT "talhoes_propriedade_id_fkey" FOREIGN KEY ("propriedade_id") REFERENCES "propriedades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_iniciado_por_fkey" FOREIGN KEY ("iniciado_por") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_propriedade_id_fkey" FOREIGN KEY ("propriedade_id") REFERENCES "propriedades"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_talhao_id_fkey" FOREIGN KEY ("talhao_id") REFERENCES "talhoes"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artefatos" ADD CONSTRAINT "artefatos_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artefatos" ADD CONSTRAINT "artefatos_talhao_id_fkey" FOREIGN KEY ("talhao_id") REFERENCES "talhoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_severidade_fkey" FOREIGN KEY ("severidade") REFERENCES "alerta_severidades"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_status_fkey" FOREIGN KEY ("status") REFERENCES "alerta_status"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_talhao_id_fkey" FOREIGN KEY ("talhao_id") REFERENCES "talhoes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas_sicar" ADD CONSTRAINT "consultas_sicar_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas_sicar" ADD CONSTRAINT "consultas_sicar_propriedade_id_fkey" FOREIGN KEY ("propriedade_id") REFERENCES "propriedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
