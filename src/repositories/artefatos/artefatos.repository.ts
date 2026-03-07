import { Artefato, ArtefatoTipo } from '@prisma/client';
import { prisma } from '../../config/prisma';

export class ArtefatosRepository {
  async findByTalhaoId(talhaoId: string): Promise<Artefato[]> {
    return prisma.artefato.findMany({
      where: { talhaoId },
      orderBy: { geradoEm: 'desc' },
    });
  }

  async findByPropriedadeId(propriedadeId: string): Promise<Artefato[]> {
    return prisma.artefato.findMany({
      where: {
        talhao: {
          propriedadeId,
        },
      },
      include: {
        talhao: {
          select: {
            nome: true,
            codigo: true,
          },
        },
      },
      orderBy: { geradoEm: 'desc' },
    });
  }

  async findByClienteId(clienteId: string): Promise<Artefato[]> {
    return prisma.artefato.findMany({
      where: {
        talhao: {
          propriedade: {
            clienteId,
          },
        },
      },
      include: {
        talhao: {
          select: {
            nome: true,
            codigo: true,
            propriedade: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: { geradoEm: 'desc' },
    });
  }

  async findByJobId(jobId: string): Promise<Artefato[]> {
    return prisma.artefato.findMany({
      where: { jobId },
    });
  }

  async findById(id: string) {
    return prisma.artefato.findUnique({
      where: { id },
      include: {
        talhao: {
          select: {
            propriedade: {
              select: {
                clienteId: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: Omit<Artefato, 'id' | 'geradoEm'>): Promise<Artefato> {
    return prisma.artefato.create({
      data,
    });
  }
}
