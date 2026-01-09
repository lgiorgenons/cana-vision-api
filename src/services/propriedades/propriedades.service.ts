import { Prisma, Propriedade } from '@prisma/client';
import { CreatePropriedadeDto, UpdatePropriedadeDto } from '../../dtos/propriedades/propriedades.dto';
import { PropriedadeRepository } from '../../repositories/propriedades/propriedades.repository';
import { ApplicationError } from '../../common/errors/application-error';

export class PropriedadeService {
  constructor(private readonly propriedadeRepository: PropriedadeRepository = new PropriedadeRepository()) {}

  async create(data: CreatePropriedadeDto): Promise<Propriedade> {
    try {
      // TODO: check for duplicates can be more specific, e.g. find by codigoInterno and clienteId
      return await this.propriedadeRepository.create(data);
          } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                // Unique constraint violation
                throw new ApplicationError('Já existe uma propriedade com este código interno para o cliente ou com o mesmo código CAR.', 409);
              }
            }
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar propriedade.';
            throw new ApplicationError(`Erro ao criar propriedade: ${errorMessage}`, 500);
    
    }
  }

  async findAll(clienteId: string): Promise<Omit<Propriedade, 'geojson'>[]> {
    return this.propriedadeRepository.findAllByClienteId(clienteId);
  }

  async findById(id: string, authClienteId: string): Promise<Propriedade> {
    const propriedade = await this.propriedadeRepository.findByIdWithTalhoes(id);
    if (!propriedade || propriedade.clienteId !== authClienteId) {
      throw new ApplicationError('Propriedade não encontrada', 404);
    }
    return propriedade;
  }

  async update(id: string, data: UpdatePropriedadeDto, authClienteId: string): Promise<Propriedade> {
    await this.findById(id, authClienteId); // Ensure it exists and user has access
    try {
      return await this.propriedadeRepository.update(id, data);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new ApplicationError('Já existe uma propriedade com este código interno para o cliente ou com o mesmo código CAR.', 409);
        }
      }
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar propriedade.';
      throw new ApplicationError(`Erro ao atualizar propriedade: ${errorMessage}`, 500);
    }
  }

  async delete(id: string, authClienteId: string): Promise<Propriedade> {
    await this.findById(id, authClienteId); // Ensure it exists and user has access
    try {
      return await this.propriedadeRepository.delete(id);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao deletar propriedade.';
      throw new ApplicationError(`Erro ao deletar propriedade: ${errorMessage}`, 500);
    }
  }
}
