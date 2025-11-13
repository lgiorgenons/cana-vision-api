import type { Usuario as PrismaUsuario } from '@prisma/client';

import { prisma } from '@config/prisma';
import type {
  Usuario as UsuarioEntity,
  UsuarioRole,
  UsuarioStatus,
} from '@domain/entities/usuario.entity';

export interface CreateUsuarioInput {
  id?: string;
  nome: string;
  email: string;
  passwordHash: string;
  role: UsuarioRole;
  status: UsuarioStatus;
  clienteId?: string | null;
}

export interface UpdateUsuarioInput {
  nome?: string;
  email?: string;
  passwordHash?: string;
  role?: UsuarioRole;
  status?: UsuarioStatus;
  clienteId?: string | null;
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: Date | null;
}

export interface UsuariosRepository {
  create(data: CreateUsuarioInput): Promise<UsuarioEntity>;
  findByEmail(email: string): Promise<UsuarioEntity | null>;
  findById(id: string): Promise<UsuarioEntity | null>;
  update(id: string, data: UpdateUsuarioInput): Promise<UsuarioEntity>;
}

class PrismaUsuariosRepository implements UsuariosRepository {
  async create(data: CreateUsuarioInput): Promise<UsuarioEntity> {
    const record = await prisma.usuario.create({
      data: {
        id: data.id,
        nome: data.nome,
        email: data.email,
        passwordHash: data.passwordHash,
        roleCodigo: data.role,
        status: data.status,
        clienteId: data.clienteId ?? null,
      },
    });

    return this.toDomain(record);
  }

  async findByEmail(email: string): Promise<UsuarioEntity | null> {
    const record = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  async findById(id: string): Promise<UsuarioEntity | null> {
    const record = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  async update(id: string, data: UpdateUsuarioInput): Promise<UsuarioEntity> {
    const record = await prisma.usuario.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email,
        passwordHash: data.passwordHash,
        roleCodigo: data.role,
        status: data.status,
        clienteId: data.clienteId,
        resetTokenHash: data.resetTokenHash,
        resetTokenExpiresAt: data.resetTokenExpiresAt,
      },
    });

    return this.toDomain(record);
  }

  private toDomain(record: PrismaUsuario): UsuarioEntity {
    return {
      id: record.id,
      nome: record.nome,
      email: record.email,
      role: (record.roleCodigo ?? 'cliente') as UsuarioRole,
      status: record.status as UsuarioStatus,
      clienteId: record.clienteId,
      passwordHash: record.passwordHash,
      resetTokenHash: record.resetTokenHash,
      resetTokenExpiresAt: record.resetTokenExpiresAt ?? null,
      createdAt: record.createdAt ?? null,
      updatedAt: record.updatedAt ?? null,
    };
  }
}

export const usuariosRepository: UsuariosRepository =
  new PrismaUsuariosRepository();
