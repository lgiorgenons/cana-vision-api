import { Router } from 'express';

import { authRouter } from './auth/auth.routes';
import talhoesRouter from './talhoes/talhoes.routes';
import propriedadesRouter from './propriedades/propriedades.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/propriedades', propriedadesRouter);
routes.use('/talhoes', talhoesRouter);

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export { routes };