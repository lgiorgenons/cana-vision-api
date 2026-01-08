import { NextFunction, Request, Response } from 'express';
import { validate } from '../../../middlewares/validation.middleware';
import { createTalhaoSchema, updateTalhaoSchema } from '../../../dtos/talhoes/talhoes.dto';

export class TalhaoValidator {
  static createTalhao(req: Request, res: Response, next: NextFunction) {
    validate(req, res, createTalhaoSchema, next);
  }

  static updateTalhao(req: Request, res: Response, next: NextFunction) {
    validate(req, res, updateTalhaoSchema, next);
  }
}
