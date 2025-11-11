import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { routes } from '@api/routes';
import { errorHandler } from '@middlewares/error-handler.middleware';

const app = express();
const METHODS_REQUIRING_JSON = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  if (!METHODS_REQUIRING_JSON.has(req.method)) {
    return next();
  }

  const contentLength = Number(req.headers['content-length'] ?? 0);
  if (!Number.isFinite(contentLength) || contentLength === 0) {
    return next();
  }

  if (req.is('application/json')) {
    return next();
  }

  return res.status(415).json({
    message:
      'Content-Type "application/json" é obrigatório para este endpoint.',
  });
});
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(errorHandler);

export { app };
