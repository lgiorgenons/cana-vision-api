import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';

import { routes } from '@api/routes';
import { env } from '@config/env';
import { logger } from '@config/logger';
import { errorHandler } from '@middlewares/error-handler.middleware';

const app = express();
const METHODS_REQUIRING_JSON = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const captureRawJson = (req: Request, _res: Response, buffer: Buffer) => {
  if (buffer?.length) {
    req.rawBody = buffer.toString('utf-8');
  }
};

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
app.use(express.json({ limit: '2mb', verify: captureRawJson }));
app.use(express.urlencoded({ extended: true }));

if (env.DEBUG_REQUEST_LOGS) {
  app.use((req, _res, next) => {
    if (req.is('application/json') && req.rawBody) {
      logger.debug(
        {
          method: req.method,
          url: req.originalUrl,
          rawBody: req.rawBody,
        },
        'JSON recebido (debug).',
      );
    }
    next();
  });
}

app.use('/api', routes);

app.use(errorHandler);

export { app };