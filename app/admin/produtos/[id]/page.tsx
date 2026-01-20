'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Product, Category, ProductStatus } from '@/lib/types'
import ImageUpload from '@/components/admin/ImageUpload'
import VideoUpload from '@/components/admin/VideoUpload'
import { useToast } from '@/contexts/ToastContext'

export default function AdminProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const isNew = productId === 'novo'
  const { addToast } = useToast()

  const [loading, setLoading] = useState(!isNew)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    artistic_description: '',
    technical_info: '',
    category_id: '',
    status: 'available',
    price: undefined,
    hero_video_url: '',
    image_urls: [],
    display_order: 0,
  })

  useEffect(() => {
    fetchCategories()
    if (!isNew) {
      fetchProduct()
    }
  }, [productId])

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('display_order')
    if (data) setCategories(data as Category[])
  }

  const fetchProduct = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (data) {
      setFormData(data as Product)
    }
    setLoading(false)
  }

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
      const { error } = await supabase.from('products').insert(formData)
      if (error) {
        addToast('error', `Erro ao criar produto: ${error.message}`)
        setLoading(false)
        return
      }
      addToast('success', 'Produto criado com sucesso!')
    } else {
      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', productId)
      
      if (error) {
        addToast('error', `Erro ao atualizar produto: ${error.message}`)
        setLoading(false)
        return
      }
      addToast('success', 'Produto atualizado com sucesso!')
    }

    setTimeout(() => {
      router.push('/admin/produtos')
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
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow transition-colors text-sm"
        >
          ← Voltar para Produtos
        </Link>
      </div>

      <h1 className="text-3xl font-display font-bold text-cyber-text mb-8">
        {isNew ? 'Novo Produto' : 'Editar Produto'}
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
            Categoria *
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
            required
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          >
            <option value="available">Disponível</option>
            <option value="sold_out">Sold Out</option>
            <option value="made_to_order">Sob Encomenda</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Descrição *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Descrição Artística
          </label>
          <textarea
            value={formData.artistic_description}
            onChange={(e) => setFormData({ ...formData, artistic_description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Info Técnica
          </label>
          <textarea
            value={formData.technical_info}
            onChange={(e) => setFormData({ ...formData, technical_info: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-cyber-text mb-2">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || undefined })}
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Vídeo Hero (upload)
          </label>
          <VideoUpload
            existingUrl={formData.hero_video_url || undefined}
            onUploadComplete={(url) => setFormData({ ...formData, hero_video_url: url || '' })}
          />
          <p className="text-xs text-cyber-textDim mt-2">
            Opcional: faça upload direto de um vídeo para este produto.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            URL do Vídeo Hero (manual)
          </label>
          <input
            type="url"
            value={formData.hero_video_url}
            onChange={(e) => setFormData({ ...formData, hero_video_url: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Imagens do Produto
          </label>
          <ImageUpload
            onUploadComplete={(urls) => setFormData({ ...formData, image_urls: urls })}
            existingUrls={formData.image_urls || []}
            multiple={true}
          />
          <p className="text-xs text-cyber-textDim mt-2">
            Arraste imagens ou clique para fazer upload. Você também pode adicionar URLs manualmente abaixo.
          </p>
          <textarea
            value={formData.image_urls?.join('\n') || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              image_urls: e.target.value.split('\n').filter(url => url.trim()) 
            })}
            rows={3}
            placeholder="Ou cole URLs aqui (uma por linha):&#10;https://example.com/image1.jpg"
            className="w-full mt-2 px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors text-sm"
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

