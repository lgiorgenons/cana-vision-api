import { Prisma, Propriedade } from '@prisma/client';
import { CreatePropriedadeDto, UpdatePropriedadeDto } from '../../dtos/propriedades/propriedades.dto';
import { PropriedadeRepository } from '../../repositories/propriedades/propriedades.repository';
import { ApplicationError } from '../../common/errors/application-error';
import { ClienteNotFoundError, PropriedadeAlreadyExistsError } from '@common/errors/propriedades-error';

export class PropriedadeService {
  constructor(private readonly propriedadeRepository: PropriedadeRepository = new PropriedadeRepository()) {}

  async create(data: CreatePropriedadeDto): Promise<Propriedade> {
  try {
    return await this.propriedadeRepository.create(data)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') throw new PropriedadeAlreadyExistsError()
      if (err.code === 'P2003') throw new ClienteNotFoundError()
    }
    throw err
  }
}

  async findAll(clienteId: string): Promise<Propriedade[]> {
    return this.propriedadeRepository.findAll({
      where: { clienteId },
    });
  }

  async findById(id: string): Promise<Propriedade> {
    const propriedade = await this.propriedadeRepository.findById(id);
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
