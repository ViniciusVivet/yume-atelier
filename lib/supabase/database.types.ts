/**
 * Supabase Database Types
 * Auto-generated types for database schema
 * 
 * Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
 * 
 * For now, manual types based on schema:
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          artistic_description: string | null
          technical_info: string | null
          category_id: string
          status: 'available' | 'sold_out' | 'made_to_order'
          price: number | null
          hero_video_url: string | null
          image_urls: string[]
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          artistic_description?: string | null
          technical_info?: string | null
          category_id: string
          status: 'available' | 'sold_out' | 'made_to_order'
          price?: number | null
          hero_video_url?: string | null
          image_urls: string[]
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          artistic_description?: string | null
          technical_info?: string | null
          category_id?: string
          status?: 'available' | 'sold_out' | 'made_to_order'
          price?: number | null
          hero_video_url?: string | null
          image_urls?: string[]
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          background_image_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          background_image_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          background_image_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          global_background_image_url: string | null
          global_background_video_url: string | null
          site_title: string
          site_description: string
          whatsapp_number: string
          whatsapp_message_template: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          global_background_image_url?: string | null
          global_background_video_url?: string | null
          site_title: string
          site_description: string
          whatsapp_number: string
          whatsapp_message_template: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          global_background_image_url?: string | null
          global_background_video_url?: string | null
          site_title?: string
          site_description?: string
          whatsapp_number?: string
          whatsapp_message_template?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_status: 'available' | 'sold_out' | 'made_to_order'
    }
  }
}

