import { randomBytes } from 'node:crypto';

import { hash } from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Session, User } from '@supabase/supabase-js';

import {
  ConflictError,
  UnauthorizedError,
} from '@common/errors/application-error';
import { env } from '@config/env';
import {
  supabaseAdminClient,
  supabaseAuthClient,
} from '@config/supabase';
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
import type { UsuariosRepository } from '@repositories/usuarios/usuarios.repository';

const DEFAULT_ROLE: UsuarioRole = 'cliente';
const SUPABASE_PROVIDER = 'supabase';

export class AuthService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async register(payload: RegisterDTO): Promise<AuthResponse> {
    const normalizedEmail = payload.email.toLowerCase();
    const existing = await this.usuariosRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('E-mail já está em uso.');
    }

    const { data, error } = await supabaseAuthClient.auth.signUp({
      email: normalizedEmail,
      password: payload.password,
      options: {
        data: {
          nome: payload.nome,
          role: payload.role ?? DEFAULT_ROLE,
          clienteId: payload.clienteId ?? null,
        },
        emailRedirectTo: env.SUPABASE_PASSWORD_RESET_REDIRECT,
      },
    });

    if (error) {
      throw new ConflictError(
        error.message ?? 'Não foi possível registrar o usuário no Supabase.',
      );
    }

    const supabaseUser = data.user;
    if (!supabaseUser || !supabaseUser.email) {
      throw new UnauthorizedError(
        'Supabase não retornou os dados do usuário recém-criado.',
      );
    }

    const usuario = await this.syncLocalUserFromSupabase(supabaseUser, {
      nome: payload.nome,
      role: payload.role ?? DEFAULT_ROLE,
      clienteId: payload.clienteId ?? null,
      password: payload.password,
    });

    return {
      user: this.presentUser(usuario),
      tokens: this.presentSessionTokens(data.session ?? undefined),
      provider: SUPABASE_PROVIDER,
      requiresEmailConfirmation: !data.session,
    };
  }

  async login(payload: LoginDTO): Promise<AuthResponse> {
    const normalizedEmail = payload.email.toLowerCase();
    const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
      email: normalizedEmail,
      password: payload.password,
    });

    if (error || !data.user) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    const usuario = await this.syncLocalUserFromSupabase(data.user);
    this.ensureUserIsActive(usuario);

    return {
      user: this.presentUser(usuario),
      tokens: this.presentSessionTokens(data.session ?? undefined),
      provider: SUPABASE_PROVIDER,
    };
  }

  async requestPasswordReset(
    payload: ForgotPasswordDTO,
  ): Promise<ForgotPasswordResponse> {
    const normalizedEmail = payload.email.toLowerCase();
    await supabaseAuthClient.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: env.SUPABASE_PASSWORD_RESET_REDIRECT,
    });

    return {
      message:
        'Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.',
    };
  }

  async resetPassword(
    payload: ResetPasswordDTO,
  ): Promise<ResetPasswordResponse> {
    const decoded = this.decodeSupabaseToken(payload.token);
    await supabaseAdminClient.auth.admin.updateUserById(decoded.sub, {
      password: payload.password,
    });

    const passwordHash = await hash(payload.password, 10);
    await this.usuariosRepository.update(decoded.sub, {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      status: 'ativo',
    });

    return { message: 'Senha redefinida com sucesso.' };
  }

  async refreshTokens(payload: RefreshTokenDTO): Promise<AuthResponse> {
    const { data, error } = await supabaseAuthClient.auth.refreshSession({
      refresh_token: payload.refreshToken,
    });

    if (error || !data.session || !data.session.user) {
      throw new UnauthorizedError('Refresh token inválido.');
    }

    const usuario = await this.syncLocalUserFromSupabase(data.session.user);
    this.ensureUserIsActive(usuario);

    return {
      user: this.presentUser(usuario),
      tokens: this.presentSessionTokens(data.session),
      provider: SUPABASE_PROVIDER,
    };
  }

  async logout(payload: LogoutDTO): Promise<LogoutResponse> {
    if (payload.refreshToken) {
      try {
        const decoded = this.decodeSupabaseToken(payload.refreshToken);
        await supabaseAdminClient.auth.admin.signOut(decoded.sub);
      } catch {
        // Ignora erros no logout para não expor detalhes.
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

  private presentSessionTokens(session?: Session | null) {
    if (!session) {
      return undefined;
    }

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at ?? undefined,
      tokenType: session.token_type,
    };
  }

  private async syncLocalUserFromSupabase(
    supabaseUser: User,
    fallback?: {
      nome?: string;
      role?: UsuarioRole;
      clienteId?: string | null;
      password?: string;
    },
  ): Promise<Usuario> {
    const email = supabaseUser.email?.toLowerCase();
    if (!email) {
      throw new UnauthorizedError('Usuário do Supabase sem e-mail associado.');
    }

    const existing = await this.usuariosRepository.findByEmail(email);
    const status = supabaseUser.email_confirmed_at ? 'ativo' : 'pendente';

    if (existing) {
      if (existing.status !== status) {
        return this.usuariosRepository.update(existing.id, { status });
      }
      return existing;
    }

    const passwordSource =
      fallback?.password ?? randomBytes(32).toString('hex');
    const passwordHash = await hash(passwordSource, 10);

    return this.usuariosRepository.create({
      id: supabaseUser.id,
      nome:
        (supabaseUser.user_metadata?.nome as string) ??
        fallback?.nome ??
        email,
      email,
      passwordHash,
      role:
        (supabaseUser.user_metadata?.role as UsuarioRole) ??
        fallback?.role ??
        DEFAULT_ROLE,
      status,
      clienteId:
        (supabaseUser.user_metadata?.clienteId as string | null) ??
        fallback?.clienteId ??
        null,
    });
  }

  private ensureUserIsActive(usuario: Usuario) {
    if (usuario.status !== 'ativo') {
      throw new UnauthorizedError('Usuário inativo ou pendente de confirmação.');
    }
  }

  private decodeSupabaseToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        env.SUPABASE_JWT_SECRET,
      ) as JwtPayload & { sub: string };
      if (!decoded?.sub) {
        throw new UnauthorizedError('Token inválido.');
      }
      return decoded;
    } catch {
      throw new UnauthorizedError('Token inválido.');
    }
  }
}
