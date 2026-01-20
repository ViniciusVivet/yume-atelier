'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SiteSettings } from '@/lib/types'

interface SiteSettingsContextType {
  settings: SiteSettings | null
  loading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Verificar se Supabase está configurado
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setLoading(false)
          return
        }

        const supabase = createClient()
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single()
        
        if (data && !error) {
          setSettings(data as SiteSettings)
        }
      } catch (err) {
        console.error('Error fetching site settings:', err)
        // Não quebra a aplicação - apenas loga o erro
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return context
}

