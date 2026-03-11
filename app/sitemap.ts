import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3002'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl()

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ]

  try {
    const supabase = createServerClient()
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('slug, updated_at').order('display_order'),
      supabase.from('categories').select('slug, updated_at').order('display_order'),
    ])

    if (productsRes.data?.length) {
      for (const p of productsRes.data) {
        entries.push({
          url: `${base}/produto/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
    if (categoriesRes.data?.length) {
      for (const c of categoriesRes.data) {
        entries.push({
          url: `${base}/categoria/${c.slug}`,
          lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch {
    // fallback: only home
  }

  return entries
}
