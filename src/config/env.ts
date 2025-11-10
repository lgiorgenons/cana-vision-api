import { config } from 'dotenv-flow';
import type { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';

config({ silent: true });

type JwtExpires = NonNullable<SignOptions['expiresIn']>;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  LOG_LEVEL: z.string().default('info'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório.'),
  REDIS_URL: z.string().min(1, 'REDIS_URL é obrigatório.'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET é obrigatório.'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET é obrigatório.'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  RESET_TOKEN_EXPIRES_MINUTES: z.coerce.number().default(60),
  SICAR_API_BASE: z.string().optional(),
  CORE_WORKFLOW_BIN: z.string().optional(),
});

const parsedEnv = envSchema.parse(process.env);
type ParsedEnv = typeof parsedEnv;
type EnvWithJwt = Omit<ParsedEnv, 'JWT_ACCESS_EXPIRES_IN' | 'JWT_REFRESH_EXPIRES_IN'> & {
  JWT_ACCESS_EXPIRES_IN: JwtExpires;
  JWT_REFRESH_EXPIRES_IN: JwtExpires;
};

export const env: EnvWithJwt = {
  ...parsedEnv,
  JWT_ACCESS_EXPIRES_IN: parsedEnv.JWT_ACCESS_EXPIRES_IN as JwtExpires,
  JWT_REFRESH_EXPIRES_IN: parsedEnv.JWT_REFRESH_EXPIRES_IN as JwtExpires,
};

export type Env = typeof env;
