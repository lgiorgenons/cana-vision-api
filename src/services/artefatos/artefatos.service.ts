import { ArtefatosRepository } from '../../repositories/artefatos/artefatos.repository';
import { PropriedadeService } from '../propriedades/propriedades.service';
import { StorageClient, storageClient } from '../../integrations/storage/storage.client';
import { ApplicationError, ForbiddenError, NotFoundError } from '../../common/errors/application-error';

export class ArtefatosService {
  constructor(
    private readonly artefatosRepository: ArtefatosRepository = new ArtefatosRepository(),
    private readonly propriedadeService: PropriedadeService = new PropriedadeService(),
    private readonly storage: StorageClient = storageClient
  ) {}

  /**
   * Formata a resposta do artefato com o identificador semântico
   */
  private formatResponse(art: any) {
    const propId = art.propriedadeId || art.talhao?.propriedadeId;
    const shortPropId = propId ? propId.split('-')[0] : 'unknown';
    
    // Formata data para YYYYMMDD
    const dateStr = art.dataReferencia 
      ? new Date(art.dataReferencia).toISOString().split('T')[0].replace(/-/g, '')
      : '00000000';

    const sufixo = art.talhao?.codigo ? `_${art.talhao.codigo}` : '';
    const identificador = `${shortPropId}-${dateStr}-${art.indice}${sufixo}`;

    return {
      ...art,
      identificador,
      url: `/api/artefatos/${art.id}/download`,
    };
  }

  /**
   * Lista todos os artefatos de uma propriedade (ou seus talhões)
   */
  async listByPropriedade(propriedadeId: string, authClienteId: string) {
    // Valida se a propriedade pertence ao cliente
    await this.propriedadeService.findById(propriedadeId, authClienteId);

    const artefatos = await this.artefatosRepository.findByPropriedadeId(propriedadeId);

    return artefatos.map((art) => this.formatResponse(art));
  }

  /**
   * Lista todos os artefatos vinculados ao cliente
   */
  async listByCliente(authClienteId: string) {
    const artefatos = await this.artefatosRepository.findByClienteId(authClienteId);

    return artefatos.map((art) => this.formatResponse(art));
  }

  /**
   * Retorna metadados de um artefato específico com URL (Proxy).
   */
  async getById(artefatoId: string, authClienteId: string) {
    const artefato = await this.artefatosRepository.findById(artefatoId);

    if (!artefato) {
      throw new NotFoundError('Artefato não encontrado');
    }

    // Tenancy: Verifica tanto no talhão quanto diretamente na propriedade
    const artefatosClienteId = artefato.talhao?.propriedade?.clienteId || artefato.propriedade?.clienteId;
    
    if (artefatosClienteId !== authClienteId) {
      throw new ForbiddenError('Acesso negado a este artefato');
    }
    
    return this.formatResponse(artefato);
  }

  /**
   * Retorna um stream de leitura do arquivo validando tenancy.
   */
  async downloadStream(artefatoId: string, authClienteId: string) {
    const artefato = await this.artefatosRepository.findById(artefatoId);

    if (!artefato) {
      throw new NotFoundError('Artefato não encontrado');
    }

    const artefatosClienteId = artefato.talhao?.propriedade?.clienteId || artefato.propriedade?.clienteId;
    
    if (artefatosClienteId !== authClienteId) {
      throw new ForbiddenError('Acesso negado a este artefato');
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
