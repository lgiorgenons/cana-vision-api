export type UsuarioRole = 'admin' | 'gestor' | 'analista' | 'cliente';
export type UsuarioStatus = 'ativo' | 'bloqueado' | 'pendente';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UsuarioRole;
  status: UsuarioStatus;
  clienteId?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  passwordHash?: string | null;
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: Date | null;
  metadata?: Record<string, unknown> | null;
}
