import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getAuthUserFromRequest, isAdminByEmail } from '@/lib/utils/api-auth'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all products
export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(*)`)
    .order('display_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST - Create new product (user por cookie ou Bearer token)
export async function POST(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const isAdmin = await isAdminByEmail(user.email)
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('products')
    .insert({ ...body, updated_at: new Date().toISOString() } as never)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

