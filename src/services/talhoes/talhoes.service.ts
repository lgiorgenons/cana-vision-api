import { Prisma, Talhao } from '@prisma/client';
import { CreateTalhaoDto, UpdateTalhaoDto } from '../../dtos/talhoes/talhoes.dto';
import { TalhaoRepository } from '../../repositories/talhoes/talhoes.repository';
import { ApplicationError } from '../../common/errors/application-error';
import { PropriedadeRepository } from '../../repositories/propriedades/propriedades.repository';

export class TalhaoService {
  constructor(
    private readonly talhaoRepository: TalhaoRepository = new TalhaoRepository(),
    private readonly propriedadeRepository: PropriedadeRepository = new PropriedadeRepository()
  ) {}

  async create(data: CreateTalhaoDto, authClienteId: string): Promise<Talhao> {
    const propriedade = await this.propriedadeRepository.findById(data.propriedadeId);
    if (!propriedade || propriedade.clienteId !== authClienteId) {
      throw new ApplicationError('Propriedade não encontrada ou não pertence ao cliente.', 404);
    }

    try {
      return await this.talhaoRepository.create(data);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApplicationError('Já existe um talhão com este código para a propriedade.', 409);
        }
      }
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar talhão.';
      throw new ApplicationError(`Erro ao criar talhão: ${errorMessage}`, 500);
    }
  }

  async findAll(authClienteId: string, propriedadeId?: string): Promise<Omit<Talhao, 'geojson'>[]> {
    if (!propriedadeId) {
      // For now, we are not supporting fetching all talhoes for a client without specifying a property.
      // This could be a heavy operation and should be handled with pagination.
      // A future implementation could list all talhoes for a client's properties.
      throw new ApplicationError('O ID da propriedade é obrigatório para listar os talhões.', 400);
    }
    
    const propriedade = await this.propriedadeRepository.findById(propriedadeId);
    if (!propriedade || propriedade.clienteId !== authClienteId) {
      throw new ApplicationError('Propriedade não encontrada ou não pertence ao cliente.', 404);
    }
    
    return this.talhaoRepository.findAll({ where: { propriedadeId } });
  }

  async findById(id: string, authClienteId: string): Promise<Talhao> {
    const talhao = await this.talhaoRepository.findByIdWithPropriedade(id);
    
    if (!talhao || talhao.propriedade?.clienteId !== authClienteId) {
      throw new ApplicationError('Talhão não encontrado.', 404);
    }

    // Remove the included 'propriedade' relation before returning
    const { propriedade, ...result } = talhao;
    return result as Talhao;
  }

  async update(id: string, data: UpdateTalhaoDto, authClienteId: string): Promise<Talhao> {
    await this.findById(id, authClienteId); // Ensure it exists and user has access

    if (data.propriedadeId) {
      const propriedade = await this.propriedadeRepository.findById(data.propriedadeId);
      if (!propriedade || propriedade.clienteId !== authClienteId) {
        throw new ApplicationError('Propriedade de destino não encontrada ou não pertence ao cliente.', 404);
      }
    }

    try {
      return await this.talhaoRepository.update(id, data);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApplicationError('Já existe um talhão com este código para a propriedade.', 409);
        }
      }
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar talhão.';
      throw new ApplicationError(`Erro ao atualizar talhão: ${errorMessage}`, 500);
    }
  }

  async delete(id: string, authClienteId: string): Promise<Talhao> {
    await this.findById(id, authClienteId); // Ensure it exists and user has access
    try {
      return await this.talhaoRepository.delete(id);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao deletar talhão.';
      throw new ApplicationError(`Erro ao deletar talhão: ${errorMessage}`, 500);
    }
  }
}
