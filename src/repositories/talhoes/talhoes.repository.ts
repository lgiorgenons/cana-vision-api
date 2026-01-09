import { Prisma, Talhao } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateTalhaoDto, UpdateTalhaoDto } from '../../dtos/talhoes/talhoes.dto';

export class TalhaoRepository {
  async create(data: CreateTalhaoDto): Promise<Talhao> {
    return prisma.talhao.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TalhaoWhereUniqueInput;
    where?: Prisma.TalhaoWhereInput;
    orderBy?: Prisma.TalhaoOrderByWithRelationInput;
  }): Promise<Omit<Talhao, 'geojson'>[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return prisma.talhao.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        nome: true,
        codigo: true,
        propriedadeId: true,
        areaHectares: true,
        safra: true,
        variedade: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAllWithGeojson(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TalhaoWhereUniqueInput;
    where?: Prisma.TalhaoWhereInput;
    orderBy?: Prisma.TalhaoOrderByWithRelationInput;
  }): Promise<Talhao[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return prisma.talhao.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }


  async findById(id: string): Promise<Talhao | null> {
    return prisma.talhao.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTalhaoDto): Promise<Talhao> {
    return prisma.talhao.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Talhao> {
    return prisma.talhao.delete({
      where: { id },
    });
  }
}
