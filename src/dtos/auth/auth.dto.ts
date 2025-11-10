import type { UsuarioRole } from '@domain/entities/usuario.entity';

export interface RegisterDTO {
  nome: string;
  email: string;
  password: string;
  role?: UsuarioRole;
  clienteId?: string | null;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface AuthUserDTO {
  id: string;
  nome: string;
  email: string;
  role: UsuarioRole;
  clienteId?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUserDTO;
  tokens: AuthTokens;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
}
