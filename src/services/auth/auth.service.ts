import { randomBytes } from 'node:crypto';

import { compare, hash } from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';

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
  LogoutDTO,
  LogoutResponse,
  RefreshTokenDTO,
  RegisterDTO,
  ResetPasswordDTO,
  ResetPasswordResponse,
} from '@dtos/auth/auth.dto';
import type { UsuariosRepository } from '@repositories/usuarios/usuarios.repository';

const DEFAULT_ROLE = 'cliente' as const;
const RESET_TOKEN_SEPARATOR = '.';

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

    this.ensureUserIsActive(usuario);

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
      ...(env.NODE_ENV !== 'production'
        ? { resetToken: this.composeResetToken(usuario.id, rawToken) }
        : {}),
    };
  }

  async resetPassword(
    payload: ResetPasswordDTO,
  ): Promise<ResetPasswordResponse> {
    const { userId, tokenPart } = this.parseResetToken(payload.token);
    const usuario = await this.usuariosRepository.findById(userId);

    if (
      !usuario ||
      !usuario.resetTokenHash ||
      !usuario.resetTokenExpiresAt
    ) {
      throw new UnauthorizedError('Token de redefinição inválido.');
    }

    const isExpired = usuario.resetTokenExpiresAt.getTime() < Date.now();
    if (isExpired) {
      throw new UnauthorizedError('Token de redefinição expirado.');
    }

    const tokenMatches = await compare(tokenPart, usuario.resetTokenHash);
    if (!tokenMatches) {
      throw new UnauthorizedError('Token de redefinição inválido.');
    }

    const passwordHash = await hash(payload.password, 10);
    await this.usuariosRepository.update(usuario.id, {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    });

    return { message: 'Senha redefinida com sucesso.' };
  }

  async refreshTokens(payload: RefreshTokenDTO): Promise<AuthResponse> {
    const decoded = this.verifyRefreshToken(payload.refreshToken);
    const usuario = await this.usuariosRepository.findById(decoded.sub);

    if (!usuario) {
      throw new UnauthorizedError('Refresh token inválido.');
    }

    this.ensureUserIsActive(usuario);

    return {
      user: this.presentUser(usuario),
      tokens: this.generateTokens(usuario),
    };
  }

  async logout(payload: LogoutDTO): Promise<LogoutResponse> {
    if (payload.refreshToken) {
      try {
        this.verifyRefreshToken(payload.refreshToken);
      } catch {
        // Não propagamos erro de logout para evitar vazamento de informações.
      }
    }

    return { message: 'Logout realizado com sucesso.' };
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

  private composeResetToken(userId: string, token: string) {
    return `${userId}${RESET_TOKEN_SEPARATOR}${token}`;
  }

  private parseResetToken(token: string) {
    const [userId, tokenPart] = token.split(RESET_TOKEN_SEPARATOR);
    if (!userId || !tokenPart) {
      throw new UnauthorizedError('Token de redefinição inválido.');
    }

    return { userId, tokenPart };
  }

  private ensureUserIsActive(usuario: Usuario) {
    if (usuario.status !== 'ativo') {
      throw new UnauthorizedError('Usuário inativo ou bloqueado.');
    }
  }

  private verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        env.JWT_REFRESH_SECRET,
      ) as JwtPayload & { sub: string };
      if (!decoded?.sub) {
        throw new UnauthorizedError('Refresh token inválido.');
      }
      return decoded;
    } catch {
      throw new UnauthorizedError('Refresh token inválido.');
    }
  }
}
