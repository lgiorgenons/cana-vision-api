import { Propriedade } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreatePropriedadeDto, UpdatePropriedadeDto } from '../../dtos/propriedades/propriedades.dto';

export class PropriedadeRepository {
  async create(data: CreatePropriedadeDto): Promise<Propriedade> {
    return prisma.propriedade.create({
      data,
    });
  }

  async findAllByClienteId(clienteId: string): Promise<Omit<Propriedade, 'geojson'>[]> {
    return prisma.propriedade.findMany({
      where: { clienteId },
      select: {
        id: true,
        nome: true,
        codigoInterno: true,
        clienteId: true,
        codigoSicar: true,
        areaHectares: true,
        culturaPrincipal: true,
        safraAtual: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByIdWithTalhoes(id: string): Promise<Propriedade | null> {
    return prisma.propriedade.findUnique({
      where: { id },
      include: {
        talhoes: {
          select: {
            id: true,
            nome: true,
            codigo: true,
            areaHectares: true,
            safra: true,
            variedade: true,
            propriedadeId: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      },
    });
  }

  async findById(id: string): Promise<Propriedade | null> {
    return prisma.propriedade.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdatePropriedadeDto): Promise<Propriedade> {
    return prisma.propriedade.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Propriedade> {
    return prisma.propriedade.delete({
      where: { id },
    });
  }
}