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
   * Lista todos os artefatos de uma propriedade com URLs da nossa API (Proxy).
   */
  async listByPropriedade(propriedadeId: string, authClienteId: string) {
    // Valida se a propriedade pertence ao cliente
    await this.propriedadeService.findById(propriedadeId, authClienteId);

    const artefatos = await this.artefatosRepository.findByPropriedadeId(propriedadeId);

    return artefatos.map((art) => ({
      ...art,
      url: `/api/artefatos/${art.id}/download`,
    }));
  }

  /**
   * Lista todos os artefatos vinculados ao cliente com URLs da nossa API (Proxy).
   */
  async listByCliente(authClienteId: string) {
    const artefatos = await this.artefatosRepository.findByClienteId(authClienteId);

    return artefatos.map((art) => ({
      ...art,
      url: `/api/artefatos/${art.id}/download`,
    }));
  }

  /**
   * Retorna metadados de um artefato específico com URL da nossa API (Proxy).
   */
  async getById(artefatoId: string, authClienteId: string) {
    const artefato = await this.artefatosRepository.findById(artefatoId);

    if (!artefato) {
      throw new ApplicationError('Artefato não encontrado', 404);
    }

    const artefatosClienteId = artefato.talhao?.propriedade?.clienteId;
    
    if (artefatosClienteId !== authClienteId) {
      throw new ApplicationError('Acesso negado a este artefato', 403);
    }
    
    return {
      ...artefato,
      url: `/api/artefatos/${artefato.id}/download`,
      talhao: undefined 
    };
  }

  /**
   * Retorna um stream de leitura do arquivo validando tenancy.
   */
  async downloadStream(artefatoId: string, authClienteId: string) {
    const artefato = await this.artefatosRepository.findById(artefatoId);

    if (!artefato) {
      throw new ApplicationError('Artefato não encontrado', 404);
    }

    const artefatosClienteId = artefato.talhao?.propriedade?.clienteId;
    
    if (artefatosClienteId !== authClienteId) {
      throw new ApplicationError('Acesso negado a este artefato', 403);
    }

    const stream = this.storage.getReadStream(artefato.caminho);
    const fileName = artefato.caminho.split('/').pop() || 'download.tif';

    return {
      stream,
      fileName,
      tipo: artefato.tipo
    };
  }
}
