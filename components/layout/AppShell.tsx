'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import { CategoriesProvider } from '@/contexts/CategoriesContext'
import PageTransition from '@/components/ui/PageTransition'
import CursorGlow from '@/components/ui/CursorGlow'
import { Category } from '@/lib/types'

export default function AppShell({
  children,
  categories,
}: {
  children: ReactNode
  categories: Category[]
}) {
  const pathname = usePathname()

  const isAdminArea = pathname?.startsWith('/admin')
  const isAuthArea = pathname === '/login' || pathname === '/admin/login'

  return (
    <CategoriesProvider initialCategories={categories || []}>
      <div className="min-h-screen bg-cyber-dark text-cyber-text">
        <CursorGlow />
        <Header />
        <main className="relative">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </CategoriesProvider>
  )
}


