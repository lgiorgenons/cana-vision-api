import { Router } from 'express';
import { ImagensController } from '../../controllers/imagens/imagens.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = Router();
const imagensController = new ImagensController();

// LISTAR TIFFs DO GCS
router.get(
  '/',
  authMiddleware,
  imagensController.listImages
);

export default router;
