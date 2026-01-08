import { NextFunction, Request, Response } from 'express';
import { validate } from '../../../middlewares/validation.middleware';
import { createPropriedadeSchema, updatePropriedadeSchema } from '../../../dtos/propriedades/propriedades.dto';

export class PropriedadeValidator {
  static createPropriedade(req: Request, res: Response, next: NextFunction) {
    validate(req, res, createPropriedadeSchema, next);
  }

  static updatePropriedade(req: Request, res: Response, next: NextFunction) {
    validate(req, res, updatePropriedadeSchema, next);
  }
}