'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Verificar se Supabase está configurado
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('❌ Supabase não configurado! Verifique o arquivo .env.local e reinicie o servidor (Ctrl+C e depois npm run dev)')
        setLoading(false)
        return
      }

      if (isSignUp) {
        // Sign up - criar conta direto pelo site
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          }
        })

        if (signUpError) {
          let errorMessage = signUpError.message
          
          // Traduzir erros comuns
          if (signUpError.message.includes('already registered')) {
            errorMessage = 'Este email já está cadastrado. Faça login ou use outro email.'
          } else if (signUpError.message.includes('Invalid email')) {
            errorMessage = 'Email inválido. Verifique e tente novamente.'
          } else if (signUpError.message.includes('Password')) {
            errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.'
          } else if (signUpError.message.includes('fetch') || signUpError.message.includes('network')) {
            errorMessage = 'Erro de conexão. Verifique se o Supabase está configurado corretamente no .env.local e reinicie o servidor.'
          }
          
          setError(errorMessage)
          setLoading(false)
          return
        }

        if (data.user) {
          // Se o Supabase não exigir confirmação de email, já faz login
          if (data.session) {
            router.push('/admin')
            router.refresh()
          } else {
            setError('✅ Conta criada! Verifique seu email para confirmar e depois faça login.')
            setTimeout(() => {
              setIsSignUp(false)
            }, 3000)
          }
        }
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          const raw = signInError.message
          let errorMessage = raw

          // Traduzir erros comuns
          if (raw.includes('Invalid login credentials')) {
            errorMessage = 'Email ou senha incorretos. Verifique e tente novamente.'
          } else if (raw.includes('Email not confirmed')) {
            errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
          } else if (raw.includes('fetch') || raw.includes('network') || raw.includes('Failed to fetch')) {
            errorMessage = 'Erro de conexão. Na Vercel: confira variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY). No Supabase: Authentication → URL Configuration → adicione a URL do site (ex: https://yume-atelier.vercel.app).'
          } else if (raw.includes('Database') || raw.includes('database') || raw.includes('JWT') || raw.includes('config')) {
            errorMessage = `Erro de configuração (Supabase/Vercel): "${raw}". Verifique as variáveis na Vercel e a URL do site no Supabase (Authentication → URL Configuration).`
          }

          console.error('[YUME Login]', errorMessage, '(raw:', raw, ')')
          setError(errorMessage)
          setLoading(false)
          return
        }

        if (data.session) {
          // Check if admin (you can customize this - check email or user metadata)
          router.push('/admin')
          router.refresh()
        } else {
          setError('Erro: sessão não criada. Tente novamente.')
          setLoading(false)
        }
      }
    } catch (err: any) {
      const msg = err?.message || String(err)
      console.error('[YUME Login] Erro completo:', err)
      let errorMessage: string
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('ERR_NAME_NOT_RESOLVED')) {
        errorMessage = 'Erro de conexão com Supabase. Na Vercel: confira as variáveis de ambiente. No Supabase: Authentication → URL Configuration → adicione a URL do seu site (ex: https://yume-atelier.vercel.app).'
      } else {
        errorMessage = `Erro ao processar: ${msg}`
      }
      setError(errorMessage)
      setLoading(false)
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
          <p className="text-cyber-textDim mb-8">
            {isSignUp ? 'Criar Conta' : 'Entrar na Conta'}
          </p>

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
                placeholder="seu@email.com"
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
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                  text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className={`p-4 rounded-lg text-sm ${
                error.includes('criada') || error.includes('Verifique')
                  ? 'bg-green-400/10 border border-green-400/30 text-green-400'
                  : 'bg-red-400/10 border border-red-400/30 text-red-400'
              }`}>
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
              {loading 
                ? (isSignUp ? 'Criando...' : 'Entrando...') 
                : (isSignUp ? 'Criar Conta' : 'Entrar')
              }
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="text-cyber-textDim hover:text-cyber-glow text-sm transition-colors"
              >
                {isSignUp 
                  ? 'Já tem uma conta? Entrar' 
                  : 'Não tem conta? Criar uma'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

