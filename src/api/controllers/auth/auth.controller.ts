import type { NextFunction, Request, Response } from 'express';

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  logoutSchema,
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

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = resetPasswordSchema.parse(req.body);
      const response = await this.service.resetPassword(payload);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = refreshTokenSchema.parse(req.body);
      const response = await this.service.refreshTokens(payload);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = logoutSchema.parse(req.body ?? {});
      const response = await this.service.logout(payload);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}

export const authController = new AuthController();
