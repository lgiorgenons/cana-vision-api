import { Request, Response } from 'express';
import { ArtefatosService } from '../../../services/artefatos/artefatos.service';
import { UnauthorizedError } from '../../../common/errors/application-error';

/**
 * Controller focado na entrega final de imagens para o usuário final/frontend.
 * Utiliza o ArtefatosService por baixo do pano para garantir a segurança multitenancy.
 */
export class ImagensController {
  constructor(private readonly artefatosService: ArtefatosService = new ArtefatosService()) {}

  /**
   * Retorna metadados da imagem e a Signed URL para visualização (VIEW)
   * GET /api/imagens/:id/view
   */
  async view(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou sem cliente associado.');
    }
    const imagem = await this.artefatosService.getSignedUrl(id, req.user.clienteId);
    
    // Mapeamos para um formato mais amigável ao frontend se necessário
    return res.status(200).json({
      id: imagem.id,
      nome: imagem.caminho.split('/').pop(),
      tipo: imagem.tipo,
      indice: imagem.indice,
      url: imagem.url,
      geradoEm: imagem.geradoEm,
      metadata: imagem.metadata
    });
  }

  /**
   * Redireciona o usuário diretamente para o download no GCS
   * GET /api/imagens/:id/download
   */
  async download(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!req.user || !req.user.clienteId) {
      throw new UnauthorizedError('Usuário não autenticado ou sem cliente associado.');
    }
    const imagem = await this.artefatosService.getSignedUrl(id, req.user.clienteId);
    
    return res.redirect(302, imagem.url);
  }
}
