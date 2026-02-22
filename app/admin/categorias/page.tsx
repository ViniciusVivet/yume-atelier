'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')

    if (data) setCategories(data as Category[])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? A imagem de fundo também será removida do servidor.')) return

    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      alert(data.error || 'Erro ao excluir categoria')
      return
    }

    fetchData()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-8 py-12">
        <p className="text-cyber-textDim">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-8 py-12">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow transition-colors text-sm"
        >
          ← Voltar para Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-cyber-text">
          Categorias
        </h1>
        <Link
          href="/admin/categorias/nova"
          className="px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
            text-cyber-glow font-display font-semibold
            hover:bg-cyber-glow/30 hover:shadow-glow transition-all"
        >
          + Nova Categoria
        </Link>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6
              backdrop-blur-sm flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="text-xl font-display font-semibold text-cyber-text mb-1">
                {category.name}
              </h3>
              <p className="text-cyber-textDim text-sm">
                {category.slug}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/admin/categorias/${category.id}`}
                className="px-4 py-2 rounded-lg bg-cyber-light/50 border border-cyber-border
                  text-cyber-text hover:bg-cyber-light/70 transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(category.id)}
                className="px-4 py-2 rounded-lg bg-red-400/10 border border-red-400/30
                  text-red-400 hover:bg-red-400/20 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-cyber-textDim mb-4">Nenhuma categoria cadastrada.</p>
            <Link
              href="/admin/categorias/nova"
              className="inline-block px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
                text-cyber-glow font-display font-semibold
                hover:bg-cyber-glow/30 hover:shadow-glow transition-all"
            >
              Criar Primeira Categoria
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

