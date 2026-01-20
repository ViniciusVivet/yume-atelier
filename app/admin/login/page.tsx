'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Home } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark px-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow mb-6 transition-colors"
        >
          <Home className="w-4 h-4" />
          Voltar para a loja
        </Link>

        <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-display font-bold text-cyber-glow mb-2">
            YUME Atelier
          </h1>
          <p className="text-cyber-textDim mb-8">Painel Administrativo</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-cyber-text mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                  text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyber-text mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                  text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
                text-cyber-glow font-display font-semibold
                hover:bg-cyber-glow/30 hover:shadow-glow transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

