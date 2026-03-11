/**
 * Utilitarios admin para Client Components (nao importar em pages/ ou client)
 */

import { createClient } from '@/lib/supabase/client'

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
 * Retorna o email do usuario atual (client-side)
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
