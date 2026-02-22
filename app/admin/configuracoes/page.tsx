'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SiteSettings } from '@/lib/types'
import { useToast } from '@/contexts/ToastContext'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()
  const [formData, setFormData] = useState<Partial<SiteSettings>>({
    site_title: 'YUME Atelier',
    site_description: '',
    whatsapp_number: '',
    whatsapp_message_template: 'Salve! Tenho interesse na peça {PRODUCT_NAME} do YUME Atelier.',
    global_background_image_url: '',
    global_background_video_url: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (data) {
      setFormData(data as SiteSettings)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    
    // Get existing settings ID
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .single()

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update(formData)
        .eq('id', existing.id)
      
      if (error) {
        addToast('error', `Erro ao salvar configurações: ${error.message}`)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert(formData)
      
      if (error) {
        addToast('error', `Erro ao criar configurações: ${error.message}`)
        setSaving(false)
        return
      }
    }

    addToast('success', 'Configurações salvas com sucesso!')
    setSaving(false)
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
          href="/admin"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow transition-colors text-sm"
        >
          ← Voltar para Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-display font-bold text-cyber-text mb-8">
        Configurações do Site
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Título do Site *
          </label>
          <input
            type="text"
            value={formData.site_title}
            onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Descrição do Site
          </label>
          <textarea
            value={formData.site_description}
            onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Número do WhatsApp *
          </label>
          <input
            type="text"
            value={formData.whatsapp_number}
            onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            placeholder="5511999999999"
            required
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
          <p className="text-xs text-cyber-textDim mt-1">
            Formato: código do país + DDD + número (sem espaços ou caracteres especiais)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            Template da Mensagem WhatsApp *
          </label>
          <textarea
            value={formData.whatsapp_message_template}
            onChange={(e) => setFormData({ ...formData, whatsapp_message_template: e.target.value })}
            rows={3}
            required
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
          <p className="text-xs text-cyber-textDim mt-1">
            Use {'{PRODUCT_NAME}'} para incluir o nome do produto automaticamente
          </p>
          <div className="mt-2 p-3 rounded-lg bg-cyber-darker border border-cyber-border">
            <p className="text-xs text-cyber-textDim uppercase tracking-wider mb-1">Preview da mensagem:</p>
            <p className="text-cyber-text text-sm whitespace-pre-wrap break-words">
              {(formData.whatsapp_message_template || '')
                .replace(/\{PRODUCT_NAME\}/gi, 'Blusa Jeans Example')}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            URL da Imagem de Fundo Global
          </label>
          <input
            type="url"
            value={formData.global_background_image_url}
            onChange={(e) => setFormData({ ...formData, global_background_image_url: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">
            URL do Vídeo de Fundo Global
          </label>
          <input
            type="url"
            value={formData.global_background_video_url}
            onChange={(e) => setFormData({ ...formData, global_background_video_url: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
              text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
              text-cyber-glow font-display font-semibold
              hover:bg-cyber-glow/30 hover:shadow-glow transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  )
}

