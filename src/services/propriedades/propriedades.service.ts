import { Propriedade } from '@prisma/client';
import { CreatePropriedadeDto, UpdatePropriedadeDto } from '../../dtos/propriedades/propriedades.dto';
import { PropriedadeRepository } from '../../repositories/propriedades/propriedades.repository';
import { ApplicationError } from '../../common/errors/application-error';

export class PropriedadeService {
  constructor(private readonly propriedadeRepository: PropriedadeRepository = new PropriedadeRepository()) {}

  async create(data: CreatePropriedadeDto): Promise<Propriedade> {
    // TODO: Add any business logic before creation, e.g., checking for duplicates
    return this.propriedadeRepository.create(data);
  }

  async findAll(clienteId: string): Promise<Omit<Propriedade, 'geojson'>[]> {
    return this.propriedadeRepository.findAllByClienteId(clienteId);
  }

  async findById(id: string): Promise<Propriedade> {
    const propriedade = await this.propriedadeRepository.findByIdWithTalhoes(id);
    if (!propriedade) {
      throw new ApplicationError('Propriedade não encontrada', 404);
    }
    return propriedade;
  }

  async update(id: string, data: UpdatePropriedadeDto): Promise<Propriedade> {
    await this.findById(id); // Ensure it exists
    return this.propriedadeRepository.update(id, data);
  }

  async delete(id: string): Promise<Propriedade> {
    await this.findById(id); // Ensure it exists
    return this.propriedadeRepository.delete(id);
  }
}
