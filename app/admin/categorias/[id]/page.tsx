'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'
import { useToast } from '@/contexts/ToastContext'

export default function AdminCategoryEditPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const isNew = categoryId === 'nova'
  const { addToast } = useToast()

  const [loading, setLoading] = useState(!isNew)
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    background_image_url: '',
    display_order: 0,
  })

  const fetchCategory = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (data) {
      setFormData(data as Category)
    }
    setLoading(false)
  }, [categoryId])

  useEffect(() => {
    if (!isNew) {
      fetchCategory()
    }
  }, [fetchCategory, isNew])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    // Generate slug if not provided
    if (!formData.slug && formData.name) {
      formData.slug = generateSlug(formData.name)
    }

    if (isNew) {
      const { error } = await supabase.from('categories').insert(formData)
      if (error) {
        addToast('error', `Erro ao criar categoria: ${error.message}`)
        setLoading(false)
        return
      }
      addToast('success', 'Categoria criada com sucesso!')
    } else {
      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', categoryId)
      
      if (error) {
        addToast('error', `Erro ao atualizar categoria: ${error.message}`)
        setLoading(false)
        return
      }
      addToast('success', 'Categoria atualizada com sucesso!')
    }

    setTimeout(() => {
      router.push('/admin/categorias')
    }, 500)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-8 py-12">
        <p className="text-cyber-textDim">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-8 py-12 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/admin/categorias"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow transition-colors text-sm"
        >
          ← Voltar para Categorias
        </Link>
      </div>

      <h1 className="text-3xl font-display font-bold text-cyber-text mb-8">
        {isNew ? 'Nova Categoria' : 'Editar Categoria'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Nome *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="gerado-automaticamente"
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            URL da Imagem de Fundo
          </label>
          <input
            type="url"
            value={formData.background_image_url}
            onChange={(e) => setFormData({ ...formData, background_image_url: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Ordem de Exibição
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
              text-cyber-glow font-display font-semibold
              hover:bg-cyber-glow/30 hover:shadow-glow transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg bg-cyber-light/50 border border-cyber-border
              text-cyber-text hover:bg-cyber-light/70 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

