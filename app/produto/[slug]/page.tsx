import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductFocus from '@/components/inventory/ProductFocus'
import WhatsAppCTA from '@/components/ui/WhatsAppCTA'
import { Product } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { withTimeout } from '@/lib/utils/withTimeout'
import { getDemoProductBySlug } from '@/lib/demo/demoData'
import DemoBanner from '@/components/landing/DemoBanner'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product = null
  let settings = null

  try {
    const supabase = createServerClient()

    // Fetch product
    const productResult = await withTimeout(
      supabase
        .from('products')
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .eq('slug', params.slug)
        .single(),
      2500,
      'fetch product'
    )

    if (!productResult.data) {
      notFound()
    }

    product = productResult.data

    // Fetch site settings for WhatsApp
    const settingsResult = await withTimeout(
      supabase.from('site_settings').select('*').single(),
      2500,
      'fetch site settings'
    )
    
    settings = settingsResult.data
  } catch (err) {
    console.error('Error fetching product:', err)
    product = getDemoProductBySlug(params.slug)
    if (!product) notFound()
  }

  if (!product) {
    product = getDemoProductBySlug(params.slug)
    if (!product) notFound()
  }

  return (
    <div className="min-h-screen relative">
      {String((product as any)?.id || '').startsWith('demo-') && (
        <div className="relative z-20">
          <DemoBanner />
        </div>
      )}
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {product.image_urls[0] && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${product.image_urls[0]})` }}
          />
        )}
        <div className="absolute inset-0 bg-cyber-dark/90 backdrop-blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 py-16">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href={product.category ? `/categoria/${product.category.slug}` : '/'}
            className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {product.category ? `Voltar para ${product.category.name}` : 'Voltar para Loja'}
          </Link>
        </div>

        <ProductFocus
          product={product as Product}
          phoneNumber={settings?.whatsapp_number || ''}
          messageTemplate={settings?.whatsapp_message_template}
        />
      </div>
    </div>
  )
}

