/**
 * Cliente Supabase com SERVICE_ROLE key - so para uso em API routes no server.
 * Bypassa RLS. Nunca exponha no client.
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY (e NEXT_PUBLIC_SUPABASE_URL) sao obrigatorios para esta operacao.')
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
