/**
 * Utilitários para Supabase Storage
 * Extração de path a partir de URL pública para deletar arquivos
 */

const BUCKET_NAME = 'yume-atelier'

/**
 * Extrai o path do arquivo no Storage a partir da URL pública do Supabase.
 * Retorna null se a URL não for do nosso bucket (ex: URL externa, Unsplash).
 */
export function getStoragePathFromPublicUrl(publicUrl: string): string | null {
  if (!publicUrl || typeof publicUrl !== 'string') return null
  try {
    // Formato: https://<project>.supabase.co/storage/v1/object/public/yume-atelier/products/xxx.jpg
    const marker = `/object/public/${BUCKET_NAME}/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return null
    return publicUrl.slice(idx + marker.length).split('?')[0] || null
  } catch {
    return null
  }
}

/**
 * Verifica se a URL é do nosso Supabase Storage (para saber se podemos deletar).
 */
export function isSupabaseStorageUrl(publicUrl: string): boolean {
  return getStoragePathFromPublicUrl(publicUrl) !== null
}
