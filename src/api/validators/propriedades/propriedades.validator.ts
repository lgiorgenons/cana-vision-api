import { NextFunction, Request, Response } from 'express';
import { validate } from '../../../middlewares/validation.middleware';
import { createPropriedadeSchema, paramsIdSchema, paramsPropriedadeIdSchema, updatePropriedadeSchema } from '../../../dtos/propriedades/propriedades.dto';

export class PropriedadeValidator {
  static createPropriedade(req: Request, res: Response, next: NextFunction) {
    validate(req, res, createPropriedadeSchema, next);
  }

  static updatePropriedade(req: Request, res: Response, next: NextFunction) {
    validate(req, res, updatePropriedadeSchema, next);
  }

  static validateId(req: Request, res: Response, next: NextFunction) {
    validate(req, res, paramsIdSchema, next, 'params');
  }

  static validatePropriedadeId(req: Request, res: Response, next: NextFunction) {
    validate(req, res, paramsPropriedadeIdSchema, next, 'params');
  }
}