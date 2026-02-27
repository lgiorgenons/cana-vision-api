import { Router } from 'express';
import { ImagensController } from '../../controllers/imagens/imagens.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = Router();
const imagensController = new ImagensController();

/**
 * @route GET /api/imagens/:id/view
 * @desc Retorna metadados da imagem e Signed URL para visualização individual.
 */
router.get(
  '/:id/view',
  authMiddleware,
  (req, res, next) => imagensController.view(req, res).catch(next)
);

/**
 * @route GET /api/imagens/:id/download
 * @desc Redireciona para o download direto da imagem no GCS.
 */
router.get(
  '/:id/download',
  authMiddleware,
  (req, res, next) => imagensController.download(req, res).catch(next)
);

export default router;
