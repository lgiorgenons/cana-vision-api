export type UsuarioRole = 'admin' | 'gestor' | 'analista' | 'cliente';
export type UsuarioStatus = 'ativo' | 'bloqueado' | 'pendente';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UsuarioRole;
  status: UsuarioStatus;
  clienteId?: string | null;
  passwordHash: string;
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
