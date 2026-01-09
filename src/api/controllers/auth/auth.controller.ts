import type { NextFunction, Request, Response } from 'express';

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@api/validators/auth/auth.validator';
import { env } from '@config/env';
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
      const { user, tokens } = await this.service.login(payload);

      if (!tokens) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokens.expiresIn ? tokens.expiresIn * 1000 : undefined,
        path: '/',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
      });

      return res.status(200).json({ user });
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
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: 'Refresh token não encontrado.' });
      }

      const { user, tokens } = await this.service.refreshTokens({
        refreshToken,
      });

      if (!tokens) {
        return res.status(401).json({ message: 'Falha na autenticação' });
      }

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokens.expiresIn ? tokens.expiresIn * 1000 : undefined,
        path: '/',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
      });

      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.logout({});

      res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
      });

      res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
      });

      return res.status(200).json({ message: 'Logout realizado com sucesso.' });
    } catch (error) {
      return next(error);
    }
  };
}

export const authController = new AuthController();
