/**
 * Verificacao admin apenas para Server Components (usa next/headers)
 */

import { createServerClient } from '@/lib/supabase/server'

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
