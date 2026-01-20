import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createServerClient } from '@/lib/supabase/server'
import { CartProvider } from '@/contexts/CartContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { withTimeout } from '@/lib/utils/withTimeout'
import AppShell from '@/components/layout/AppShell'
import { demoCategories } from '@/lib/demo/demoData'
import { Category } from '@/lib/types'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

// Display font - you can replace with a more experimental font
const displayFont = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'YUME Atelier',
  description: 'Ateliê de Moda Disruptiva',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let categories: Category[] = []
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient()
      
      // Fetch categories for navigation with timeout protection
      const result = await withTimeout(
        supabase
          .from('categories')
          .select('id, name, slug, description, background_image_url, display_order, created_at, updated_at')
          .order('display_order', { ascending: true }),
        2000,
        'fetch nav categories'
      )
      
      if (result?.data && !result.error) {
        categories = result.data as Category[]
      }
    }
  } catch (err) {
    // Silently fail - categories will be empty array
    console.error('Error fetching categories in layout:', err)
    categories = []
  }

  // Always have categories for the UI (demo fallback)
  const shellCategories = (categories && categories.length > 0 ? categories : demoCategories)

  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${displayFont.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <SiteSettingsProvider>
            <CartProvider>
              <AppShell categories={shellCategories}>{children}</AppShell>
            </CartProvider>
          </SiteSettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

