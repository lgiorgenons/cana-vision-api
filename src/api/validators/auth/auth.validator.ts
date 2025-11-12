import { z } from 'zod';

import type { UsuarioRole } from '@domain/entities/usuario.entity';

const roleEnum: [UsuarioRole, ...UsuarioRole[]] = [
  'admin',
  'gestor',
  'analista',
  'cliente',
];

export const registerSchema = z.object({
  nome: z.string().min(3).max(150),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(roleEnum).optional(),
  clienteId: z.string().uuid().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  accessToken: z.string().min(10),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});
