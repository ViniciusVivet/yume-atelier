'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void
  existingUrls?: string[]
  multiple?: boolean
}

export default function ImageUpload({ 
  onUploadComplete, 
  existingUrls = [], 
  multiple = true 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingUrls)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `products/${fileName}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('yume-atelier')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          alert(`Erro ao fazer upload: ${uploadError.message}`)
          continue
        }

        // Get public URL
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
      alert('Erro ao fazer upload das imagens')
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

  const removeImage = (index: number) => {
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
                {multiple ? 'Múltiplas imagens suportadas' : 'Uma imagem'}
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
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-cyber-border"
              />
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

