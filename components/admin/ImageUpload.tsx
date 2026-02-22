'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { getStoragePathFromPublicUrl, isSupabaseStorageUrl } from '@/lib/utils/storage'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void
  existingUrls?: string[]
  multiple?: boolean
  /** Pasta no bucket (ex: 'products' | 'categories') */
  folder?: string
}

export default function ImageUpload({ 
  onUploadComplete, 
  existingUrls = [], 
  multiple = true,
  folder = 'products',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingUrls)
  const [dragActive, setDragActive] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    setPreviewUrls(existingUrls)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingUrls.join(',')])

  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const supabase = createClient()
    if (!supabase.storage) {
      addToast('error', 'Storage não configurado.')
      return
    }

    const toUpload: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!ALLOWED_TYPES.includes(file.type)) {
        addToast('error', `"${file.name}": apenas imagens (JPG, PNG, WebP, GIF).`)
        continue
      }
      if (file.size > MAX_SIZE_BYTES) {
        addToast('error', `"${file.name}": tamanho máximo 5MB.`)
        continue
      }
      toUpload.push(file)
    }
    if (toUpload.length === 0) return

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < toUpload.length; i++) {
        const file = toUpload[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('yume-atelier')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          addToast('error', `Erro ao fazer upload: ${uploadError.message}`)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('yume-atelier')
          .getPublicUrl(filePath)
        uploadedUrls.push(publicUrl)
      }

      const newUrls = [...previewUrls, ...uploadedUrls]
      setPreviewUrls(newUrls)
      onUploadComplete(newUrls)
    } catch (error) {
      console.error('Error:', error)
      addToast('error', 'Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFile(e.dataTransfer.files)
  }

  const removeImage = async (index: number) => {
    const url = previewUrls[index]
    const supabase = createClient()

    if (url && isSupabaseStorageUrl(url) && supabase.storage) {
      const path = getStoragePathFromPublicUrl(url)
      if (path) {
        try {
          await supabase.storage.from('yume-atelier').remove([path])
        } catch (err) {
          console.error('Erro ao deletar imagem do Storage:', err)
          addToast('error', 'Imagem removida da lista, mas falha ao deletar do servidor.')
        }
      }
    }

    const newUrls = previewUrls.filter((_, i) => i !== index)
    setPreviewUrls(newUrls)
    onUploadComplete(newUrls)
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-300
          ${dragActive 
            ? 'border-cyber-glow bg-cyber-glow/10' 
            : 'border-cyber-border bg-cyber-darker/50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-cyber-glow/50'}
        `}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFile(e.target.files)}
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-cyber-glow animate-spin mb-4" />
              <p className="text-cyber-textDim">Fazendo upload...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-cyber-textDim mb-4" />
              <p className="text-cyber-text font-semibold mb-2">
                Clique ou arraste imagens aqui
              </p>
              <p className="text-cyber-textDim text-sm">
                {multiple ? 'Múltiplas imagens suportadas' : 'Uma imagem'} • Máx. 5MB (JPG, PNG, WebP, GIF)
              </p>
            </>
          )}
        </label>
      </div>

      {/* Preview grid */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-lg border border-cyber-border overflow-hidden">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

