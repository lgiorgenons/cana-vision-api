import 'express';

import type { Usuario } from '@domain/entities/usuario.entity';

declare module 'express-serve-static-core' {
  interface Request {
    rawBody?: string;
    user?: Usuario;
  }
}