import { Router } from 'express';
import { TalhaoController } from '../../controllers/talhoes/talhoes.controller';
import { TalhaoValidator } from '../../validators/talhoes/talhoes.validator';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = Router();
const talhaoController = new TalhaoController();

router.post(
  '/',
  authMiddleware,
  TalhaoValidator.createTalhao,
  (req, res, next) => talhaoController.create(req, res).catch(next)
);

router.get(
  '/', 
  authMiddleware, 
  (req, res, next) => talhaoController.findAll(req, res).catch(next)
);

router.get(
  '/:id', 
  authMiddleware, 
  (req, res, next) => talhaoController.findById(req, res).catch(next)
);

router.put(
  '/:id',
  authMiddleware,
  TalhaoValidator.updateTalhao,
  (req, res, next) => talhaoController.update(req, res).catch(next)
);

router.delete(
  '/:id', 
  authMiddleware, 
  (req, res, next) => talhaoController.delete(req, res).catch(next)
);

export default router;
