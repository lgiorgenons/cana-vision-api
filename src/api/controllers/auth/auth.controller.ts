import type { NextFunction, Request, Response } from 'express';

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from '@api/validators/auth/auth.validator';
import { authService } from '@services/index';

class AuthController {
  constructor(private readonly service = authService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = registerSchema.parse(req.body);
      const response = await this.service.register(payload);
      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = loginSchema.parse(req.body);
      const response = await this.service.login(payload);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };

  menu = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = registerSchema.parse(req.body);
      const response = "Caio viadinho";
      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = forgotPasswordSchema.parse(req.body);
      const response = await this.service.requestPasswordReset(payload);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}

export const authController = new AuthController();
