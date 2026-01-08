import { Prisma, Propriedade } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreatePropriedadeDto, UpdatePropriedadeDto } from '../../dtos/propriedades/propriedades.dto';

export class PropriedadeRepository {
  async create(data: CreatePropriedadeDto): Promise<Propriedade> {
    return prisma.propriedade.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PropriedadeWhereUniqueInput;
    where?: Prisma.PropriedadeWhereInput;
    orderBy?: Prisma.PropriedadeOrderByWithRelationInput;
  }): Promise<Propriedade[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return prisma.propriedade.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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