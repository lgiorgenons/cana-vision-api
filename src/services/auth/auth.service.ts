import { randomBytes } from 'node:crypto';

import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  ConflictError,
  UnauthorizedError,
} from '@common/errors/application-error';
import { env } from '@config/env';
import type { Usuario } from '@domain/entities/usuario.entity';
import type {
  AuthResponse,
  ForgotPasswordDTO,
  ForgotPasswordResponse,
  LoginDTO,
  RegisterDTO,
} from '@dtos/auth/auth.dto';
import type { UsuariosRepository } from '@repositories/usuarios/usuarios.repository';

const DEFAULT_ROLE = 'cliente' as const;

export class AuthService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async register(payload: RegisterDTO): Promise<AuthResponse> {
    const normalizedEmail = payload.email.toLowerCase();
    const existing = await this.usuariosRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('E-mail já está em uso.');
    }

    const passwordHash = await hash(payload.password, 10);
    const usuario = await this.usuariosRepository.create({
      nome: payload.nome,
      email: normalizedEmail,
      passwordHash,
      role: payload.role ?? DEFAULT_ROLE,
      status: 'ativo',
      clienteId: payload.clienteId ?? null,
    });

    return {
      user: this.presentUser(usuario),
      tokens: this.generateTokens(usuario),
    };
  }

  async login(payload: LoginDTO): Promise<AuthResponse> {
    const usuario =
      await this.usuariosRepository.findByEmail(payload.email.toLowerCase());
    if (!usuario) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    const passwordMatches = await compare(
      payload.password,
      usuario.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    return {
      user: this.presentUser(usuario),
      tokens: this.generateTokens(usuario),
    };
  }

  async requestPasswordReset(
    payload: ForgotPasswordDTO,
  ): Promise<ForgotPasswordResponse> {
    const normalizedEmail = payload.email.toLowerCase();
    const usuario = await this.usuariosRepository.findByEmail(normalizedEmail);

    if (!usuario) {
      return {
        message:
          'Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.',
      };
    }

    const rawToken = randomBytes(32).toString('hex');
    const resetTokenHash = await hash(rawToken, 10);
    const expiresAt = new Date(
      Date.now() + env.RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000,
    );

    await this.usuariosRepository.update(usuario.id, {
      resetTokenHash,
      resetTokenExpiresAt: expiresAt,
    });

    return {
      message:
        'Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.',
      ...(env.NODE_ENV !== 'production' ? { resetToken: rawToken } : {}),
    };
  }

  private presentUser(usuario: Usuario) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      clienteId: usuario.clienteId ?? null,
    };
  }

  private generateTokens(usuario: Usuario) {
    const payload = {
      sub: usuario.id,
      role: usuario.role,
      clienteId: usuario.clienteId ?? null,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
}
