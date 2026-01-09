import { config } from 'dotenv-flow';
import { z } from 'zod';

config({ silent: true });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),
  LOG_LEVEL: z.string().default('info'),
  DEBUG_REQUEST_LOGS: z.coerce.boolean().default(false),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL � obrigat�rio.'),
  REDIS_URL: z.string().optional(),
  SICAR_API_BASE: z.string().optional(),
  CORE_WORKFLOW_BIN: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY � obrigat�rio.'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY � obrigat�rio.'),
  SUPABASE_PASSWORD_RESET_REDIRECT: z
    .string()
    .url('SUPABASE_PASSWORD_RESET_REDIRECT deve ser uma URL v�lida.'),
  SUPABASE_JWT_SECRET: z
    .string()
    .min(1, 'SUPABASE_JWT_SECRET � obrigat�rio para validar tokens.'),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;