import { Request, Response } from 'express';
import { ArtefatosService } from '../../../services/artefatos/artefatos.service';
import { UnauthorizedError } from '../../../common/errors/application-error';

export class ArtefatosController {
  constructor(private readonly artefatosService: ArtefatosService = new ArtefatosService()) {}

  async listByPropriedade(req: Request, res: Response): Promise<Response> {
    const { propriedadeId } = req.params;
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const artefatos = await this.artefatosService.listByPropriedade(propriedadeId, req.user.clienteId);
    return res.status(200).json(artefatos);
  }

  /**
   * Retorna os metadados e a Signed URL de um artefato específico (JSON)
   */
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const artefato = await this.artefatosService.getSignedUrl(id, req.user.clienteId);
    return res.status(200).json(artefato);
  }

  /**
   * Redireciona diretamente para o download no GCS
   */
  async download(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou não associado a um cliente.');
    }
    const artefato = await this.artefatosService.getSignedUrl(id, req.user.clienteId);
    
    // Configura o cabeçalho de download forçado se necessário (via query param)
    // Nota: O GCS lida com isso se a URL for assinada corretamente para download
    return res.redirect(302, artefato.url);
  }
}
