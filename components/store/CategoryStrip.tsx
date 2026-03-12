'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/lib/types'

interface CategoryStripProps {
  categories: Category[]
}

export default function CategoryStrip({ categories }: CategoryStripProps) {
  const router = useRouter()
  const params = useSearchParams()
  const activeSlug = params.get('category') || ''

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(params.toString())
    if (slug) next.set('category', slug)
    else next.delete('category')
    // Mantém outros filtros ativos (busca, status)
    router.push(`/?${next.toString()}`, { scroll: false })
    // Scrolla suavemente pro carrossel
    setTimeout(() => {
      document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  if (categories.length === 0) return null

  return (
    <div className="sticky top-[57px] z-40 bg-cyber-dark/90 backdrop-blur-xl border-b border-cyber-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">

          {/* "Todos" pill */}
          <button
            onClick={() => setCategory('')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold
              border transition-all duration-200 whitespace-nowrap
              ${!activeSlug
                ? 'bg-cyber-glow/20 border-cyber-glow/60 text-cyber-glow shadow-glow'
                : 'bg-transparent border-cyber-border text-cyber-textDim hover:border-cyber-glow/30 hover:text-cyber-text'
              }`}
          >
            Todos
          </button>

          {/* Separador */}
          <div className="w-px h-5 bg-cyber-border flex-shrink-0" />

          {/* Uma pill por categoria */}
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(isActive ? '' : cat.slug)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold
                  border transition-all duration-200 whitespace-nowrap
                  ${isActive
                    ? 'bg-cyber-glowAlt/20 border-cyber-glowAlt/60 text-cyber-glowAlt'
                    : 'bg-transparent border-cyber-border text-cyber-textDim hover:border-cyber-glow/30 hover:text-cyber-text'
                  }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
