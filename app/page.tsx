import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import StoreLayout from '@/components/store/StoreLayout'
import HeroLanding from '@/components/landing/HeroLanding'
import { Product, Category, SiteSettings } from '@/lib/types'
import { withTimeout } from '@/lib/utils/withTimeout'
import { demoProducts, demoCategories } from '@/lib/demo/demoData'
import DemoBanner from '@/components/landing/DemoBanner'

const FETCH_TIMEOUT = 3000

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('site_settings').select('site_title, site_description').single()
    const title = (data as { site_title?: string })?.site_title || 'YUME Atelier'
    const description = (data as { site_description?: string })?.site_description || 'Ateliê de moda disruptiva. Catálogo premium.'
    return {
      title,
      description,
      openGraph: { title, description },
    }
  } catch {
    return { title: 'YUME Atelier', description: 'Ateliê de moda disruptiva.' }
  }
}

export default async function HomePage() {
  let products: Product[] = []
  let settings: SiteSettings | null = null
  let categories: Category[] = []
  let isSupabaseConfigured = false;
  let hasRealProducts = false;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      isSupabaseConfigured = true;
      const supabase = createServerClient()

      const [productsResult, settingsResult, categoriesResult] = await Promise.allSettled([
        withTimeout(
          supabase
            .from('products')
            .select(`*, category:categories(*)`)
            .order('display_order', { ascending: true }),
          FETCH_TIMEOUT,
          'Timeout ao buscar produtos.'
        ),
        withTimeout(
          supabase
            .from('site_settings')
            .select('*')
            .single(),
          FETCH_TIMEOUT,
          'Timeout ao buscar configurações do site.'
        ),
        withTimeout(
          supabase
            .from('categories')
            .select('id, name, slug, description, background_image_url, display_order')
            .order('display_order', { ascending: true }),
          FETCH_TIMEOUT,
          'Timeout ao buscar categorias.'
        )
      ])

      if (productsResult.status === 'fulfilled' && (productsResult.value as { data?: Product[] }).data) {
        products = (productsResult.value as { data: Product[] }).data
        if (products.length > 0) hasRealProducts = true;
      } else if (productsResult.status === 'rejected') {
        console.error('Error fetching products:', productsResult.reason);
      }

      if (settingsResult.status === 'fulfilled' && (settingsResult.value as { data?: SiteSettings }).data) {
        settings = (settingsResult.value as { data: SiteSettings }).data
      } else if (settingsResult.status === 'rejected') {
        console.error('Error fetching settings:', settingsResult.reason);
      }

      if (categoriesResult.status === 'fulfilled' && (categoriesResult.value as { data?: Category[] }).data) {
        categories = (categoriesResult.value as { data: Category[] }).data
      } else if (categoriesResult.status === 'rejected') {
        console.error('Error fetching categories:', categoriesResult.reason);
      }

    } else {
      console.warn('Supabase environment variables are not set. Using demo data.');
    }
  } catch (err) {
    console.error('Unhandled error during data fetching:', err);
  }

  // If no real products, use demo data
  const finalProducts = hasRealProducts ? products : demoProducts;
  const finalCategories = categories.length > 0 ? categories : demoCategories;
  const isDemoMode = !hasRealProducts && !isSupabaseConfigured;

  // Show impressive landing page if no products and not in demo mode (e.g., Supabase configured but empty)
  if (!hasRealProducts && !isDemoMode) {
    return <HeroLanding hasProducts={false} />
  }

  return (
    <StoreLayout
      products={finalProducts}
      categories={finalCategories}
      whatsappNumber={settings?.whatsapp_number}
      whatsappTemplate={settings?.whatsapp_message_template}
      isDemoMode={isDemoMode}
    />
  )
}

