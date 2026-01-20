/**
 * YUME Atelier - Type Definitions
 * Core types for products, categories, and site settings
 */

export type ProductStatus = 'available' | 'sold_out' | 'made_to_order'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  artistic_description?: string
  technical_info?: string
  category_id: string
  status: ProductStatus
  price?: number
  hero_video_url?: string
  image_urls: string[]
  display_order: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  background_image_url?: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  global_background_image_url?: string
  global_background_video_url?: string
  site_title: string
  site_description: string
  whatsapp_number: string
  whatsapp_message_template: string
  created_at: string
  updated_at: string
}

export interface InventoryViewProduct extends Product {
  position: number // Position in the circular carousel (0 = center)
  isFocused: boolean
}

