import { createClient } from '@supabase/supabase-js';

import { env } from './env';

const supabaseOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

export const supabaseAuthClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  supabaseOptions,
);

export const supabaseAdminClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseOptions,
);
