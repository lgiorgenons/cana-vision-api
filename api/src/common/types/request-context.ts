import type { UsuarioRole } from '@domain/entities/usuario.entity';

export interface AuthenticatedRequestContext {
  userId: string;
  role: UsuarioRole;
  clienteId?: string | null;
}
