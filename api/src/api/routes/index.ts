import { Router } from 'express';

import { authRouter } from './auth/auth.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export { routes };
