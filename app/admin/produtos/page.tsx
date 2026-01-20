'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Product, Category } from '@/lib/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('display_order'),
      supabase.from('categories').select('*').order('display_order'),
    ])

    if (productsRes.data) setProducts(productsRes.data as Product[])
    if (categoriesRes.data) setCategories(categoriesRes.data as Category[])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      alert('Erro ao excluir: ' + error.message)
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
          Produtos
        </h1>
        <Link
          href="/admin/produtos/novo"
          className="px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
            text-cyber-glow font-display font-semibold
            hover:bg-cyber-glow/30 hover:shadow-glow transition-all"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6
              backdrop-blur-sm flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="text-xl font-display font-semibold text-cyber-text mb-1">
                {product.name}
              </h3>
              <p className="text-cyber-textDim text-sm">
                {product.category?.name || 'Sem categoria'} • {product.status}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/admin/produtos/${product.id}`}
                className="px-4 py-2 rounded-lg bg-cyber-light/50 border border-cyber-border
                  text-cyber-text hover:bg-cyber-light/70 transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-4 py-2 rounded-lg bg-red-400/10 border border-red-400/30
                  text-red-400 hover:bg-red-400/20 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-cyber-textDim mb-4">Nenhum produto cadastrado.</p>
            <Link
              href="/admin/produtos/novo"
              className="inline-block px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
                text-cyber-glow font-display font-semibold
                hover:bg-cyber-glow/30 hover:shadow-glow transition-all"
            >
              Criar Primeiro Produto
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

