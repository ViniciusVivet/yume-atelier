'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SiteSettings, HeroType, HeroMediaItem } from '@/lib/types'
import { useToast } from '@/contexts/ToastContext'
import HeroSettings from '@/components/admin/HeroSettings'

const DEFAULT_SETTINGS: Partial<SiteSettings> = {
  site_title: 'YUME Atelier',
  site_description: '',
  whatsapp_number: '',
  whatsapp_message_template: 'Salve! Tenho interesse na peça {PRODUCT_NAME} do YUME Atelier.',
  global_background_image_url: '',
  global_background_video_url: '',
  hero_type: 'gradient',
  hero_media_urls: [],
  hero_carousel_interval: 5,
  hero_video_start: null,
  hero_video_end: null,
  hero_video_loop: true,
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()
  const [formData, setFormData] = useState<Partial<SiteSettings>>(DEFAULT_SETTINGS)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('*').single()
    if (data) {
      setFormData({
        ...DEFAULT_SETTINGS,
        ...data,
        hero_media_urls: Array.isArray(data.hero_media_urls) ? data.hero_media_urls : [],
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { data: existing } = await supabase.from('site_settings').select('id').single()

    const payload = { ...formData }

    if (existing) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', existing.id)
      if (error) {
        addToast('error', `Erro ao salvar: ${error.message}`)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('site_settings').insert(payload)
      if (error) {
        addToast('error', `Erro ao criar: ${error.message}`)
        setSaving(false)
        return
      }
    }

    addToast('success', 'Configurações salvas!')
    setSaving(false)
  }

  const handleHeroChange = (updates: {
    hero_type?: HeroType
    hero_media_urls?: HeroMediaItem[]
    hero_carousel_interval?: number
    hero_video_start?: number | null
    hero_video_end?: number | null
    hero_video_loop?: boolean
  }) => {
    setFormData((prev) => ({ ...prev, ...updates }))
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

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Informações gerais ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-cyber-glow border-b border-cyber-border pb-2">
            Informações Gerais
          </h2>

          <div>
            <label className="block text-sm font-semibold text-cyber-text mb-2">Título do Site *</label>
            <input
              type="text"
              value={formData.site_title ?? ''}
              onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cyber-text mb-2">Descrição do Site</label>
            <textarea
              value={formData.site_description ?? ''}
              onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
            />
          </div>
        </section>

        {/* ── WhatsApp ───────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-cyber-glow border-b border-cyber-border pb-2">
            WhatsApp
          </h2>

          <div>
            <label className="block text-sm font-semibold text-cyber-text mb-2">Número *</label>
            <input
              type="text"
              value={formData.whatsapp_number ?? ''}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              placeholder="5511999999999"
              required
              className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
            />
            <p className="text-xs text-cyber-textDim mt-1">
              Código do país + DDD + número, sem espaços (ex: 5511986765219)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cyber-text mb-2">Template da Mensagem *</label>
            <textarea
              value={formData.whatsapp_message_template ?? ''}
              onChange={(e) => setFormData({ ...formData, whatsapp_message_template: e.target.value })}
              rows={3}
              required
              className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
            />
            <p className="text-xs text-cyber-textDim mt-1">
              Use {'{PRODUCT_NAME}'} para incluir o nome do produto
            </p>
            <div className="mt-2 p-3 rounded-lg bg-cyber-darker border border-cyber-border">
              <p className="text-xs text-cyber-textDim uppercase tracking-wider mb-1">Preview:</p>
              <p className="text-cyber-text text-sm whitespace-pre-wrap break-words">
                {(formData.whatsapp_message_template || '').replace(/\{PRODUCT_NAME\}/gi, 'Camisa Box YUME')}
              </p>
            </div>
          </div>
        </section>

        {/* ── Hero da Home ───────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-display font-semibold text-cyber-glow border-b border-cyber-border pb-2">
              Hero da Home
            </h2>
            <p className="text-xs text-cyber-textDim mt-2">
              Configura o fundo da seção de destaque no topo da loja.
              As mídias são enviadas para o Supabase Storage (bucket <code className="text-cyber-glow">yume-atelier</code>).
            </p>
          </div>

          <HeroSettings
            heroType={(formData.hero_type as HeroType) ?? 'gradient'}
            heroMediaUrls={(formData.hero_media_urls as HeroMediaItem[]) ?? []}
            heroCarouselInterval={formData.hero_carousel_interval ?? 5}
            heroVideoStart={formData.hero_video_start ?? null}
            heroVideoEnd={formData.hero_video_end ?? null}
            heroVideoLoop={formData.hero_video_loop ?? true}
            onChange={handleHeroChange}
          />
        </section>

        {/* ── Salvar ─────────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
            text-cyber-glow font-display font-semibold
            hover:bg-cyber-glow/30 hover:shadow-glow transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
    </div>
  )
}
