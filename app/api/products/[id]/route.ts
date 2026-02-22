import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getAuthUserFromRequest, isAdminByEmail } from '@/lib/utils/api-auth'
import { NextRequest, NextResponse } from 'next/server'
import { getStoragePathFromPublicUrl, isSupabaseStorageUrl } from '@/lib/utils/storage'

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT - Update product (user por cookie ou Bearer token)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUserFromRequest(request)
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const isAdmin = await isAdminByEmail(user.email)
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('products')
    .update({ ...body, updated_at: new Date().toISOString() } as never)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE - Delete product (user por cookie ou Bearer token)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUserFromRequest(request)
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const isAdmin = await isAdminByEmail(user.email)
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createServiceRoleClient()
  const { data: productRaw, error: fetchError } = await supabase
    .from('products')
    .select('image_urls, hero_video_url')
    .eq('id', params.id)
    .single()

  const product = productRaw as { image_urls?: string[]; hero_video_url?: string | null } | null
  if (!fetchError && product && supabase.storage) {
    const paths: string[] = []
    const imageUrls = product.image_urls || []
    for (const url of imageUrls) {
      if (isSupabaseStorageUrl(url)) {
        const path = getStoragePathFromPublicUrl(url)
        if (path) paths.push(path)
      }
    }
    if (product.hero_video_url && isSupabaseStorageUrl(product.hero_video_url)) {
      const videoPath = getStoragePathFromPublicUrl(product.hero_video_url)
      if (videoPath) paths.push(videoPath)
    }
    if (paths.length > 0) {
      await supabase.storage.from('yume-atelier').remove(paths)
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

