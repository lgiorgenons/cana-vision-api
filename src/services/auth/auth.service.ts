import jwt, { type JwtPayload } from 'jsonwebtoken';

import {
  ConflictError,
  UnauthorizedError,
} from '@common/errors/application-error';
import { env } from '@config/env';
import type { Usuario, UsuarioRole } from '@domain/entities/usuario.entity';
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
import { supabaseAdminClient, supabaseClient } from '@integrations/supabase.client';
import type { UsuariosRepository } from '@repositories/usuarios/usuarios.repository';
import type { Session, User } from '@supabase/supabase-js';

const DEFAULT_ROLE = 'cliente' as const;

export class AuthService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async register(payload: RegisterDTO): Promise<AuthResponse> {
    const normalizedEmail = this.normalizeEmail(payload.email);
    const existing = await this.usuariosRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('E-mail já está em uso.');
    }

    const { data, error } = await supabaseAdminClient.auth.admin.createUser({
      email: normalizedEmail,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        nome: payload.nome,
        role: payload.role ?? DEFAULT_ROLE,
        clienteId: payload.clienteId ?? null,
      },
    });

    if (error || !data?.user) {
      throw new ConflictError(
        error?.message ?? 'Não foi possível criar o usuário no Supabase.',
      );
    }

    const usuario = await this.usuariosRepository.create({
      id: data.user.id,
      nome: payload.nome,
      email: normalizedEmail,
      role: payload.role ?? DEFAULT_ROLE,
      status: 'ativo',
      clienteId: payload.clienteId ?? null,
      metadata: data.user.user_metadata ?? {},
      passwordHash: 'supabase-managed',
    });

    const session = await this.signInWithPassword(normalizedEmail, payload.password);

    return {
      user: this.presentUser(usuario),
      tokens: this.mapSessionTokens(session),
    };
  }

  async login(payload: LoginDTO): Promise<AuthResponse> {
    const session = await this.signInWithPassword(
      this.normalizeEmail(payload.email),
      payload.password,
    );

    const usuario = await this.ensureUsuarioFromSupabase(session.user);
    this.ensureUserIsActive(usuario);

    return {
      user: this.presentUser(usuario),
      tokens: this.mapSessionTokens(session),
    };
  }

  async requestPasswordReset(
    payload: ForgotPasswordDTO,
  ): Promise<ForgotPasswordResponse> {
    const normalizedEmail = this.normalizeEmail(payload.email);
    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: env.SUPABASE_PASSWORD_RESET_REDIRECT,
      },
    );

    if (error) {
      throw new ConflictError(error.message);
    }

    return {
      message:
        'Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.',
    };
  }

  async resetPassword(
    payload: ResetPasswordDTO,
  ): Promise<ResetPasswordResponse> {
    const userId = this.extractSupabaseUserId(payload.accessToken);

    const { error, data } = await supabaseAdminClient.auth.admin.updateUserById(
      userId,
      { password: payload.password },
    );

    if (error) {
      throw new UnauthorizedError(error.message);
    }

    if (data.user) {
      await this.ensureUsuarioFromSupabase(data.user);
    }

    return { message: 'Senha redefinida com sucesso.' };
  }

  async refreshTokens(payload: RefreshTokenDTO): Promise<AuthResponse> {
    const session = await this.refreshSupabaseSession(payload.refreshToken);
    const usuario = await this.ensureUsuarioFromSupabase(session.user);

    this.ensureUserIsActive(usuario);

    return {
      user: this.presentUser(usuario),
      tokens: this.mapSessionTokens(session),
    };
  }

  async logout(_payload: LogoutDTO): Promise<LogoutResponse> {
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

  private async ensureUsuarioFromSupabase(user: User): Promise<Usuario> {
    if (!user.email) {
      throw new UnauthorizedError('Usuário sem e-mail associado no Supabase.');
    }

    const existingById = await this.usuariosRepository.findById(user.id);
    if (existingById) {
      return existingById;
    }

    const normalizedEmail = this.normalizeEmail(user.email);
    const existingByEmail =
      (await this.usuariosRepository.findByEmail(normalizedEmail)) ?? null;

    const basePayload = {
      id: user.id,
      nome:
        (user.user_metadata?.nome as string | undefined) ??
        normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: (user.user_metadata?.role as UsuarioRole | undefined) ?? DEFAULT_ROLE,
      status: 'ativo' as const,
      clienteId: (user.user_metadata?.clienteId as string | null | undefined) ?? null,
      metadata: user.user_metadata ?? {},
      passwordHash: 'supabase-managed',
    };

    if (existingByEmail) {
      return this.usuariosRepository.update(existingByEmail.id, basePayload);
    }

    return this.usuariosRepository.create(basePayload);
  }

  private ensureUserIsActive(usuario: Usuario) {
    if (usuario.status !== 'ativo') {
      throw new UnauthorizedError('Usuário inativo ou bloqueado.');
    }
  }

  private async signInWithPassword(email: string, password: string): Promise<Session> {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedError(error?.message ?? 'Credenciais inválidas.');
    }

    return data.session;
  }

  private async refreshSupabaseSession(refreshToken: string): Promise<Session> {
    const { data, error } = await supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedError(error?.message ?? 'Refresh token inválido.');
    }

    return data.session;
  }

  private mapSessionTokens(session: Session) {
    if (!session.refresh_token) {
      throw new UnauthorizedError(
        'Sessão inválida retornada pelo Supabase (sem refresh token).',
      );
    }

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in ?? null,
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000).toISOString()
        : null,
      tokenType: session.token_type ?? 'bearer',
    };
  }

  private extractSupabaseUserId(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        env.SUPABASE_JWT_SECRET,
      ) as JwtPayload & { sub?: string };

      if (!decoded?.sub) {
        throw new UnauthorizedError('Token inválido.');
      }

      return decoded.sub;
    } catch {
      throw new UnauthorizedError('Token inválido.');
    }
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }
}
