import { Artefato, ArtefatoTipo } from '@prisma/client';
import { prisma } from '../../config/prisma';

export class ArtefatosRepository {
  async findByTalhaoId(talhaoId: string): Promise<Artefato[]> {
    return prisma.artefato.findMany({
      where: { talhaoId },
      include: {
        talhao: {
          select: { nome: true, codigo: true }
        }
      },
      orderBy: { geradoEm: 'desc' },
    });
  }

  async findByPropriedadeId(propriedadeId: string): Promise<Artefato[]> {
    return prisma.artefato.findMany({
      where: {
        OR: [
          { propriedadeId },
          { talhao: { propriedadeId } }
        ]
      },
      include: {
        talhao: {
          select: { nome: true, codigo: true }
        },
        propriedade: {
          select: { nome: true }
        }
      },
      orderBy: { geradoEm: 'desc' },
    });
  }

  async findByClienteId(clienteId: string): Promise<Artefato[]> {
    return prisma.artefato.findMany({
      where: {
        OR: [
          { propriedade: { clienteId } },
          { talhao: { propriedade: { clienteId } } }
        ]
      },
      include: {
        talhao: {
          select: {
            nome: true,
            codigo: true,
            propriedade: { select: { nome: true } }
          }
        },
        propriedade: {
          select: { nome: true }
        }
      },
      orderBy: { geradoEm: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.artefato.findUnique({
      where: { id },
      include: {
        talhao: {
          select: {
            propriedade: { select: { clienteId: true } }
          }
        },
        propriedade: {
          select: { clienteId: true }
        }
      },
    });
  }

  async create(data: any): Promise<Artefato> {
    return prisma.artefato.create({
      data,
    });
  }
}
