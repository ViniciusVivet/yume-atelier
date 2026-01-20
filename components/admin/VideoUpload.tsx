'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface VideoUploadProps {
  onUploadComplete: (url: string | null) => void
  existingUrl?: string | null
}

export default function VideoUpload({
  onUploadComplete,
  existingUrl = null,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    setUploading(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `videos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('yume-atelier')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        addToast('error', `Erro ao fazer upload do vídeo: ${uploadError.message}`)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('yume-atelier')
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
      onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Error:', error)
      addToast('error', 'Erro ao fazer upload do vídeo')
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

  const clearVideo = () => {
    setPreviewUrl(null)
    onUploadComplete(null)
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
          id="video-upload"
          className="hidden"
          accept="video/*"
          onChange={(e) => handleFile(e.target.files)}
          disabled={uploading}
        />
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-cyber-glow animate-spin mb-4" />
              <p className="text-cyber-textDim">Fazendo upload do vídeo...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-cyber-textDim mb-4" />
              <p className="text-cyber-text font-semibold mb-2">
                Clique ou arraste um vídeo aqui
              </p>
              <p className="text-cyber-textDim text-sm">
                Formatos comuns suportados (mp4, webm, etc.)
              </p>
            </>
          )}
        </label>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <video
            src={previewUrl}
            controls
            className="w-full max-h-64 rounded-lg border border-cyber-border"
          />
          <button
            type="button"
            onClick={clearVideo}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

