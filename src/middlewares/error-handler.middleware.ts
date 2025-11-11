import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import {
  ApplicationError,
  ValidationError,
} from '@common/errors/application-error';
import { logger } from '@config/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (isBodyParserSyntaxError(err)) {
    return res.status(400).json({
      message:
        'JSON inválido. Garanta um corpo bem formado com Content-Type "application/json".',
    });
  }

  if (err instanceof ZodError) {
    const details = err.flatten();
    const message = 'Erro de validação.';
    const formattedError = new ValidationError(message, details);
    return res
      .status(formattedError.statusCode)
      .json({ message, details: formattedError.details });
  }

  if (err instanceof ApplicationError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, details: err.details });
  }

  logger.error({ err }, 'Erro inesperado.');
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

function isBodyParserSyntaxError(
  err: unknown,
): err is SyntaxError & { status: number } {
  return (
    err instanceof SyntaxError &&
    typeof (err as { status?: unknown }).status === 'number'
  );
}
