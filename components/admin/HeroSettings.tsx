'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, GripVertical, Plus, Play } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { HeroType, HeroMediaItem } from '@/lib/types'

// ─── Upload helper ────────────────────────────────────────────────────────────

async function uploadToStorage(file: File, mediaType: 'image' | 'video'): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const name = `${Date.now()}-${Math.random().toString(36).slice(7)}.${ext}`
  const path = `hero/${mediaType}s/${name}`
  const { error } = await supabase.storage.from('yume-atelier').upload(path, file, { upsert: false })
  if (error) return null
  return supabase.storage.from('yume-atelier').getPublicUrl(path).data.publicUrl
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UploadZone({
  accept,
  label,
  uploading,
  onFile,
  id,
}: {
  accept: string
  label: string
  uploading: boolean
  onFile: (f: File) => void
  id: string
}) {
  return (
    <label
      htmlFor={id}
      className={`block border-2 border-dashed rounded-lg p-6 text-center transition-all
        ${uploading
          ? 'border-cyber-glow/50 opacity-60 cursor-not-allowed'
          : 'border-cyber-border hover:border-cyber-glow/50 cursor-pointer'
        }`}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      {uploading ? (
        <Loader2 className="w-8 h-8 text-cyber-glow animate-spin mx-auto" />
      ) : (
        <div>
          <Upload className="w-8 h-8 text-cyber-textDim mx-auto mb-2" />
          <p className="text-sm text-cyber-textDim">{label}</p>
        </div>
      )}
    </label>
  )
}

function SingleImageUpload({ url, onUrl }: { url: string; onUrl: (u: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const { addToast } = useToast()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { addToast('error', 'Apenas imagens.'); return }
    if (file.size > 10 * 1024 * 1024) { addToast('error', 'Máximo 10MB.'); return }
    setUploading(true)
    const result = await uploadToStorage(file, 'image')
    setUploading(false)
    if (result) onUrl(result)
    else addToast('error', 'Erro ao enviar imagem. Verifique o bucket "yume-atelier" no Supabase Storage.')
  }

  return (
    <div className="space-y-3">
      <UploadZone
        id="hero-image-upload"
        accept="image/*"
        label="Clique para selecionar uma imagem (JPG, PNG, WebP)"
        uploading={uploading}
        onFile={handleFile}
      />
      {url && (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-cyber-border group">
          <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onUrl('')}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function SingleVideoUpload({ url, onUrl }: { url: string; onUrl: (u: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const { addToast } = useToast()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) { addToast('error', 'Apenas vídeos.'); return }
    if (file.size > 100 * 1024 * 1024) { addToast('error', 'Máximo 100MB.'); return }
    setUploading(true)
    const result = await uploadToStorage(file, 'video')
    setUploading(false)
    if (result) onUrl(result)
    else addToast('error', 'Erro ao enviar vídeo. Verifique o bucket "yume-atelier" no Supabase Storage.')
  }

  return (
    <div className="space-y-3">
      <UploadZone
        id="hero-video-upload"
        accept="video/*"
        label="Clique para selecionar um vídeo (MP4, WebM — máx 100MB)"
        uploading={uploading}
        onFile={handleFile}
      />
      {url && (
        <div className="relative rounded-lg overflow-hidden border border-cyber-border group">
          <video src={url} controls className="w-full max-h-48" />
          <button
            type="button"
            onClick={() => onUrl('')}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function CarouselMediaUpload({ onAdd }: { onAdd: (item: HeroMediaItem) => void }) {
  const [uploading, setUploading] = useState(false)
  const { addToast } = useToast()

  const handleFile = async (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) { addToast('error', 'Apenas imagens ou vídeos.'); return }
    setUploading(true)
    const type: 'image' | 'video' = isImage ? 'image' : 'video'
    const result = await uploadToStorage(file, type)
    setUploading(false)
    if (result) onAdd({ url: result, type })
    else addToast('error', 'Erro ao enviar arquivo.')
  }

  return (
    <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed transition-all
      ${uploading
        ? 'border-cyber-glow/50 opacity-60 cursor-not-allowed'
        : 'border-cyber-border hover:border-cyber-glow/50 cursor-pointer'
      }`}
    >
      <input
        type="file"
        accept="image/*,video/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {uploading
        ? <Loader2 className="w-5 h-5 text-cyber-glow animate-spin flex-shrink-0" />
        : <Plus className="w-5 h-5 text-cyber-textDim flex-shrink-0" />
      }
      <span className="text-sm text-cyber-textDim">
        {uploading ? 'Enviando...' : 'Adicionar imagem ou vídeo'}
      </span>
    </label>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface HeroSettingsProps {
  heroType: HeroType
  heroMediaUrls: HeroMediaItem[]
  heroCarouselInterval: number
  heroVideoStart?: number | null
  heroVideoEnd?: number | null
  heroVideoLoop: boolean
  onChange: (updates: {
    hero_type?: HeroType
    hero_media_urls?: HeroMediaItem[]
    hero_carousel_interval?: number
    hero_video_start?: number | null
    hero_video_end?: number | null
    hero_video_loop?: boolean
  }) => void
}

const TYPE_OPTIONS: { value: HeroType; label: string; desc: string }[] = [
  { value: 'gradient', label: 'Gradiente padrão', desc: 'Fundo cyberpunk animado' },
  { value: 'image',    label: 'Imagem estática',  desc: 'Uma imagem como fundo' },
  { value: 'video',    label: 'Vídeo',            desc: 'Vídeo em loop no fundo' },
  { value: 'carousel', label: 'Carrossel',        desc: 'Múltiplas mídias alternando' },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function HeroSettings({
  heroType,
  heroMediaUrls,
  heroCarouselInterval,
  heroVideoStart,
  heroVideoEnd,
  heroVideoLoop,
  onChange,
}: HeroSettingsProps) {
  const dragIndex = useRef<number | null>(null)
  const firstUrl = heroMediaUrls[0]?.url ?? ''

  const setFirstMedia = (url: string, type: 'image' | 'video') => {
    onChange({ hero_media_urls: url ? [{ url, type }] : [] })
  }

  // Drag-and-drop reorder for carousel
  const handleDragStart = (index: number) => { dragIndex.current = index }
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const items = [...heroMediaUrls]
    const [dragged] = items.splice(dragIndex.current, 1)
    items.splice(index, 0, dragged)
    dragIndex.current = index
    onChange({ hero_media_urls: items })
  }
  const handleDragEnd = () => { dragIndex.current = null }

  return (
    <div className="space-y-6">

      {/* ── Tipo de fundo ──────────────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-cyber-text mb-3">
          Tipo de Fundo
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ hero_type: opt.value })}
              className={`p-3 rounded-lg border text-left transition-all ${
                heroType === opt.value
                  ? 'border-cyber-glow bg-cyber-glow/10 text-cyber-glow'
                  : 'border-cyber-border hover:border-cyber-glow/30 text-cyber-textDim'
              }`}
            >
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Gradient (sem config adicional) ───────────────────────────────── */}
      {heroType === 'gradient' && (
        <p className="text-sm text-cyber-textDim px-1">
          Fundo padrão com gradiente cyberpunk e kanji 夢 animado. Nenhuma configuração adicional necessária.
        </p>
      )}

      {/* ── Imagem estática ────────────────────────────────────────────────── */}
      {heroType === 'image' && (
        <div>
          <label className="block text-sm font-semibold text-cyber-text mb-2">Imagem de Fundo</label>
          <SingleImageUpload
            url={firstUrl}
            onUrl={(u) => setFirstMedia(u, 'image')}
          />
        </div>
      )}

      {/* ── Vídeo ──────────────────────────────────────────────────────────── */}
      {heroType === 'video' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-cyber-text mb-2">Vídeo de Fundo</label>
            <SingleVideoUpload
              url={firstUrl}
              onUrl={(u) => setFirstMedia(u, 'video')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-cyber-text mb-2">
                Início (segundos)
              </label>
              <input
                type="number" min="0" step="1"
                value={heroVideoStart ?? ''}
                onChange={(e) => onChange({ hero_video_start: e.target.value ? Number(e.target.value) : null })}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-cyber-darker border border-cyber-border
                  text-cyber-text focus:outline-none focus:border-cyber-glow"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cyber-text mb-2">
                Fim (segundos)
              </label>
              <input
                type="number" min="0" step="1"
                value={heroVideoEnd ?? ''}
                onChange={(e) => onChange({ hero_video_end: e.target.value ? Number(e.target.value) : null })}
                placeholder="até o final"
                className="w-full px-3 py-2 rounded-lg bg-cyber-darker border border-cyber-border
                  text-cyber-text focus:outline-none focus:border-cyber-glow"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={heroVideoLoop}
              onChange={(e) => onChange({ hero_video_loop: e.target.checked })}
              className="rounded border-cyber-border bg-cyber-darker text-cyber-glow focus:ring-cyber-glow"
            />
            <span className="text-sm text-cyber-text">Repetir em loop</span>
          </label>
        </div>
      )}

      {/* ── Carrossel ──────────────────────────────────────────────────────── */}
      {heroType === 'carousel' && (
        <div className="space-y-5">

          {/* Intervalo global */}
          <div>
            <label className="block text-sm font-semibold text-cyber-text mb-1">
              Tempo por slide:{' '}
              <span className="text-cyber-glow font-bold">{heroCarouselInterval}s</span>
            </label>
            <input
              type="range" min="2" max="12" step="1"
              value={heroCarouselInterval}
              onChange={(e) => onChange({ hero_carousel_interval: Number(e.target.value) })}
              className="w-full accent-cyber-glow"
            />
            <div className="flex justify-between text-xs text-cyber-textDim mt-1">
              <span>2s</span><span>12s</span>
            </div>
          </div>

          {/* Lista de itens */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-cyber-text">
              Itens do Carrossel{' '}
              <span className="text-cyber-textDim font-normal">— arraste para reordenar</span>
            </label>

            {heroMediaUrls.length === 0 && (
              <p className="text-xs text-cyber-textDim px-1">Nenhum item adicionado ainda.</p>
            )}

            {heroMediaUrls.map((item, index) => (
              <div
                key={item.url + index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 p-3 rounded-lg border border-cyber-border
                  bg-cyber-darker/50 cursor-grab active:cursor-grabbing select-none"
              >
                <GripVertical className="w-4 h-4 text-cyber-textDim flex-shrink-0" />

                {/* Thumbnail */}
                {item.type === 'image' ? (
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-cyber-border">
                    <Image src={item.url} alt="" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded flex-shrink-0 border border-cyber-border
                    bg-cyber-dark flex items-center justify-center">
                    <Play className="w-4 h-4 text-cyber-glow" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-cyber-text capitalize">{item.type}</p>
                  <p className="text-xs text-cyber-textDim truncate">{item.url.split('/').pop()}</p>
                </div>

                {/* Duração individual opcional */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input
                    type="number" min="1" max="30" step="1"
                    value={item.duration ?? ''}
                    onChange={(e) => {
                      const items = [...heroMediaUrls]
                      items[index] = { ...item, duration: e.target.value ? Number(e.target.value) : undefined }
                      onChange({ hero_media_urls: items })
                    }}
                    placeholder="—"
                    title="Duração individual (s) — deixe vazio para usar o padrão"
                    className="w-12 px-2 py-1 text-xs rounded bg-cyber-darker border border-cyber-border
                      text-cyber-text focus:outline-none focus:border-cyber-glow text-center"
                  />
                  <span className="text-xs text-cyber-textDim">s</span>
                </div>

                <button
                  type="button"
                  onClick={() => onChange({ hero_media_urls: heroMediaUrls.filter((_, i) => i !== index) })}
                  className="p-1 rounded text-red-400 hover:bg-red-400/10 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <CarouselMediaUpload onAdd={(item) => onChange({ hero_media_urls: [...heroMediaUrls, item] })} />
          </div>

          {/* Mini preview do primeiro item */}
          {heroMediaUrls.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-cyber-text mb-2">
                Preview (1º item)
              </label>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-cyber-border bg-cyber-dark">
                {heroMediaUrls[0].type === 'image' ? (
                  <Image src={heroMediaUrls[0].url} alt="Preview" fill className="object-cover" unoptimized />
                ) : (
                  <video
                    src={heroMediaUrls[0].url}
                    autoPlay muted loop playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-cyber-dark/70 text-cyber-textDim text-xs">
                  {heroMediaUrls.length} item{heroMediaUrls.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
