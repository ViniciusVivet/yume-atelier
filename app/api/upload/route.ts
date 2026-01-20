import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST - Upload file to Supabase Storage
export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  
  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const folder = formData.get('folder') as string || 'products'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('yume-atelier') // Bucket name - configure in Supabase
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('yume-atelier')
    .getPublicUrl(filePath)

  return NextResponse.json({ url: publicUrl, path: filePath })
}

