import { usuariosRepository } from '@repositories/usuarios/usuarios.repository';

import { AuthService } from './auth/auth.service';

export const authService = new AuthService(usuariosRepository);
