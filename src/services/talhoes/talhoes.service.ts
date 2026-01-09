import { Talhao } from '@prisma/client';
import { CreateTalhaoDto, UpdateTalhaoDto } from '../../dtos/talhoes/talhoes.dto';
import { TalhaoRepository } from '../../repositories/talhoes/talhoes.repository';
import { ApplicationError } from '../../common/errors/application-error';
import { PropriedadeRepository } from '../../repositories/propriedades/propriedades.repository';

export class TalhaoService {
  constructor(
    private readonly talhaoRepository: TalhaoRepository = new TalhaoRepository(),
    private readonly propriedadeRepository: PropriedadeRepository = new PropriedadeRepository()
  ) {}

  async create(data: CreateTalhaoDto): Promise<Talhao> {
    const propriedade = await this.propriedadeRepository.findById(data.propriedadeId);
    if (!propriedade) {
      throw new ApplicationError('Propriedade não encontrada', 404);
    }
    return this.talhaoRepository.create(data);
  }

  async findAll(propriedadeId?: string): Promise<Talhao[]> {
    const where: any = {};
    if (propriedadeId) {
      where.propriedadeId = propriedadeId;
    }
    return this.talhaoRepository.findAll({ where });
  }

  async findById(id: string): Promise<Talhao> {
    const talhao = await this.talhaoRepository.findById(id);
    if (!talhao) {
      throw new ApplicationError('Talhão não encontrado', 404);
    }
    return talhao;
  }

  async update(id: string, data: UpdateTalhaoDto): Promise<Talhao> {
    await this.findById(id); // Ensure it exists
    if (data.propriedadeId) {
      const propriedade = await this.propriedadeRepository.findById(data.propriedadeId);
      if (!propriedade) {
        throw new ApplicationError('Propriedade não encontrada', 404);
      }
    }
    return this.talhaoRepository.update(id, data);
  }

  async delete(id: string): Promise<Talhao> {
    await this.findById(id); // Ensure it exists
    return this.talhaoRepository.delete(id);
  }
}
