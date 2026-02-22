/**
 * Utilitários para verificar se usuário é admin
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'

/**
 * Verifica se o usuário atual é admin (client-side)
 */
export async function isAdminClient(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) return false

    const { data } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email)
      .maybeSingle()

    return !!data
  } catch {
    return false
  }
}

/**
 * Verifica se o usuário atual é admin (server-side)
 */
export async function isAdminServer(): Promise<boolean> {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) return false

    const { data } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email)
      .maybeSingle()

    return !!data
  } catch {
    return false
  }
}

/**
 * Retorna o email do usuário atual (client-side)
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.email || null
  } catch {
    return null
  }
}
