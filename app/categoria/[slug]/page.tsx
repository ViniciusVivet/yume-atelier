import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StoreLayout from '@/components/store/StoreLayout'
import { Product, Category } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { withTimeout } from '@/lib/utils/withTimeout'
import { demoCategories, getDemoCategory, getDemoProductsByCategorySlug } from '@/lib/demo/demoData'
import DemoBanner from '@/components/landing/DemoBanner'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let category: Category | null = null
  let products: Product[] = []
  let settings = null

  try {
    const supabase = createServerClient()

    // Fetch category
    const categoryResult = (await withTimeout(
      supabase.from('categories').select('*').eq('slug', params.slug).single(),
      2500,
      'fetch category'
    )) as { data: Category | null }

    if (!categoryResult.data) {
      notFound()
    }

    category = categoryResult.data

    // Fetch products in this category
    const productsResult = await withTimeout(
      supabase
        .from('products')
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .eq('category_id', category.id)
        .order('display_order', { ascending: true }),
      2500,
      'fetch category products'
    )

    products = (productsResult.data as Product[]) || []

    // Fetch site settings for WhatsApp
    const settingsResult = await withTimeout(
      supabase.from('site_settings').select('*').single(),
      2500,
      'fetch site settings'
    )
    
    settings = settingsResult.data
  } catch (err) {
    console.error('Error fetching category:', err)
    // fallback demo
    category = getDemoCategory(params.slug)
    if (category) {
      products = getDemoProductsByCategorySlug(params.slug) as any
    } else {
      notFound()
    }
  }

  if (!category) {
    // fallback demo
    category = getDemoCategory(params.slug)
    if (category) {
      products = getDemoProductsByCategorySlug(params.slug) as any
    } else {
      notFound()
    }
  }

  // Use StoreLayout instead of InventoryCarousel for better UX
  return (
    <div className="min-h-screen">
      {String((category as any)?.id || '').startsWith('demo-') && <DemoBanner />}
      <div className="container mx-auto px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Loja
        </Link>
        <h1 className="text-4xl font-display font-bold text-cyber-text mb-8">
          {category.name}
        </h1>
      </div>
      <StoreLayout
        products={(products as Product[]) || []}
        categories={(demoCategories as any) || []}
        whatsappNumber={settings?.whatsapp_number}
        whatsappTemplate={settings?.whatsapp_message_template}
      />
    </div>
  )
}

