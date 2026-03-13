'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isAdminClient } from '@/lib/utils/admin'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const timeoutId = setTimeout(() => {
      if (!cancelled && ok === null) {
        setError('Nao foi possivel verificar sua sessao. Tente recarregar a pagina ou fazer login novamente.')
        setOk(false)
      }
    }, 7000)

    async function check() {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (cancelled) return
        if (!session) {
          router.replace('/login')
          return
        }
        const admin = await isAdminClient()
        if (cancelled) return
        if (!admin) {
          router.replace('/login?error=access_denied')
          return
        }
        setOk(true)
      } catch (err) {
        if (cancelled) return
        console.error('[AdminAuthGuard] erro ao validar admin:', err)
        setError('Nao foi possivel validar seu acesso ao painel admin. Tente novamente em alguns segundos.')
        setOk(false)
      }
    }
    check()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [router, ok])

  if (ok === null) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <p className="text-cyber-textDim">Carregando...</p>
      </div>
    )
  }

  if (ok === false && error) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-cyber-light/30 border border-cyber-border rounded-lg p-6 text-center space-y-4">
          <h1 className="text-xl font-display font-bold text-cyber-text">Nao foi possivel abrir o painel admin</h1>
          <p className="text-sm text-cyber-textDim whitespace-pre-line">{error}</p>
          <button
            type="button"
            onClick={() => router.replace('/login')}
            className="px-4 py-2 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50 text-cyber-glow hover:bg-cyber-glow/30 transition-colors"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="border-b border-cyber-border bg-cyber-light/30 backdrop-blur-xl">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-2xl font-display font-bold text-cyber-glow hover:text-cyber-glowAlt transition-colors">
                YUME Atelier Admin
              </Link>
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg bg-cyber-light/30 border border-cyber-border
                  text-cyber-text hover:bg-cyber-light/50 transition-colors text-sm"
              >
                Ver Loja
              </Link>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyber-light/50 border border-cyber-border
                  text-cyber-text hover:bg-cyber-light/70 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
