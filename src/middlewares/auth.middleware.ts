import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '@common/errors/application-error';
import { supabaseClient } from '@integrations/supabase.client';
import { usuariosRepository } from '@repositories/usuarios/usuarios.repository';

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de autenticação não fornecido.');
    }

    const token = authHeader.substring(7);
    const {
      data: { user: supabaseUser },
      error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !supabaseUser) {
      throw new UnauthorizedError('Token de autenticação inválido.');
    }

    const appUser = await usuariosRepository.findById(supabaseUser.id);

    if (!appUser) {
      throw new UnauthorizedError(
        'Usuário não encontrado no sistema.',
      );
    }

    if (appUser.status !== 'ativo') {
      throw new UnauthorizedError('Usuário inativo ou bloqueado.');
    }

    req.user = appUser;
    return next();
  } catch (error) {
    return next(error);
  }
}