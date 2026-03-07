import { Router } from 'express';
import { ArtefatosController } from '../../controllers/artefatos/artefatos.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = Router();
const artefatosController = new ArtefatosController();

/**
 * @route GET /api/artefatos
 * @desc Lista todos os artefatos vinculados ao cliente autenticado (todas as suas propriedades).
 */
router.get(
  '/',
  authMiddleware,
  (req, res, next) => artefatosController.listAll(req, res).catch(next)
);

/**
 * @route GET /api/artefatos/propriedade/:propriedadeId
 * @desc Lista todos os artefatos (GeoTIFFs, etc) de uma propriedade com URLs assinadas.
 */
router.get(
  '/propriedade/:propriedadeId',
  authMiddleware,
  (req, res, next) => artefatosController.listByPropriedade(req, res).catch(next)
);

/**
 * @route GET /api/artefatos/:id
 * @desc Retorna metadados e URL assinada de um único artefato.
 */
router.get(
  '/:id',
  authMiddleware,
  (req, res, next) => artefatosController.getById(req, res).catch(next)
);

/**
 * @route GET /api/artefatos/:id/download
 * @desc Redireciona para download direto do arquivo no GCS.
 */
router.get(
  '/:id/download',
  authMiddleware,
  (req, res, next) => {
    // Note: Usamos next para tratar erros assíncronos
    artefatosController.download(req, res).catch(next);
  }
);

export default router;
