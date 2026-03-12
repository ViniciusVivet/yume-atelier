'use client'

import { useMemo } from 'react'
import { Product, Category } from '@/lib/types'
import InventoryCarousel from '@/components/inventory/InventoryCarousel'
import HeroSection from '@/components/landing/HeroSection'
import CategoryStrip from '@/components/store/CategoryStrip'
import { useSearchParams } from 'next/navigation'

interface StoreLayoutProps {
  products: Product[]
  categories: Category[]
  whatsappNumber?: string
  whatsappTemplate?: string
  isDemoMode?: boolean
}

export default function StoreLayout({
  products,
  categories,
  whatsappNumber,
}: StoreLayoutProps) {
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('q') || ''
  const filterStatus = searchParams.get('status') || ''
  const filterCategorySlug = searchParams.get('category') || ''

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (filterCategorySlug) {
      filtered = filtered.filter((p) => p.category?.slug === filterCategorySlug)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.artistic_description?.toLowerCase().includes(q)
      )
    }
    if (filterStatus) {
      filtered = filtered.filter((p) => p.status === filterStatus)
    }

    return filtered
  }, [products, searchQuery, filterStatus, filterCategorySlug])

  const currentCategory = useMemo(
    () => (filterCategorySlug ? categories.find((c) => c.slug === filterCategorySlug) : null),
    [categories, filterCategorySlug]
  )

  return (
    <div className="bg-cyber-dark">

      {/* 1 ── Hero: primeira impressão */}
      <HeroSection totalProducts={products.length} categories={categories} />

      {/* 2 ── Filtro de categorias: sticky abaixo do header */}
      <CategoryStrip categories={categories} />

      {/* 3 ── Coleção: o carrossel */}
      <section id="colecao" className="scroll-mt-14">
        <InventoryCarousel
          products={filteredProducts}
          whatsappNumber={whatsappNumber}
          categoryBackground={currentCategory?.background_image_url}
        />
      </section>
    </div>
  )
}
