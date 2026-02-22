'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isAdminClient } from '@/lib/utils/admin'
import { Home, CreditCard, User } from 'lucide-react'

export default function PerfilPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) {
        window.location.href = '/login'
        return
      }
      const admin = await isAdminClient()
      if (cancelled) return
      if (admin) {
        window.location.href = '/admin'
        return
      }
      setEmail(session.user?.email ?? null)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <p className="text-cyber-textDim">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-dark px-4 py-8">
      <div className="container max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow mb-6 transition-colors"
        >
          <Home className="w-4 h-4" />
          Voltar para a loja
        </Link>

        <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-8 backdrop-blur-xl">
          <h1 className="text-2xl font-display font-bold text-cyber-glow mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Meu perfil
          </h1>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-sm text-cyber-textDim">Email</p>
              <p className="text-cyber-text font-medium">{email || '—'}</p>
            </div>
          </div>

          <section className="border-t border-cyber-border pt-6">
            <h2 className="text-lg font-semibold text-cyber-text mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Método de pagamento
            </h2>
            <p className="text-cyber-textDim text-sm">
              Em breve você poderá cadastrar e gerenciar formas de pagamento aqui.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
