import { Artefato } from '@prisma/client';
import { ArtefatosRepository } from '../../repositories/artefatos/artefatos.repository';
import { PropriedadeService } from '../propriedades/propriedades.service';
import { StorageClient, storageClient } from '../../integrations/storage/storage.client';
import { ApplicationError } from '../../common/errors/application-error';

export class ArtefatosService {
  constructor(
    private readonly artefatosRepository: ArtefatosRepository = new ArtefatosRepository(),
    private readonly propriedadeService: PropriedadeService = new PropriedadeService(),
    private readonly storage: StorageClient = storageClient
  ) {}

  /**
   * Lista todos os artefatos de uma propriedade com URLs assinadas.
   */
  async listByPropriedade(propriedadeId: string, authClienteId: string) {
    // Valida se a propriedade pertence ao cliente
    await this.propriedadeService.findById(propriedadeId, authClienteId);

    const artefatos = await this.artefatosRepository.findByPropriedadeId(propriedadeId);

    return Promise.all(
      artefatos.map(async (art) => ({
        ...art,
        url: await this.storage.getSignedUrl(art.caminho),
      }))
    );
  }

  /**
   * Gera uma URL assinada para um artefato específico com validação de cliente.
   */
  async getSignedUrl(artefatoId: string, authClienteId: string) {
    const artefato = await this.artefatosRepository.findById(artefatoId);

    if (!artefato) {
      throw new ApplicationError('Artefato não encontrado', 404);
    }

    // Validação de Tenancy: Verifica se o artefato pertence ao cliente autenticado
    const artefatosClienteId = artefato.talhao?.propriedade?.clienteId;
    
    if (artefatosClienteId !== authClienteId) {
      throw new ApplicationError('Acesso negado a este artefato', 403);
    }

    const url = await this.storage.getSignedUrl(artefato.caminho);
    
    return {
      ...artefato,
      url,
      // Remove campos de relacionamento internos antes de retornar
      talhao: undefined 
    };
  }
}
