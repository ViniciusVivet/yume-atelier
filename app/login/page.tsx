'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { isAdminClient } from '@/lib/utils/admin'

const LOG_PREFIX = '[YUME Login]'

/** Mensagem amigável para o usuário + log técnico no console (F12) */
function setLoginError(
  setError: (s: string) => void,
  userMessage: string,
  technical: { phase: string; error: unknown; status?: number; code?: string }
) {
  if (typeof window !== 'undefined') {
    console.error(LOG_PREFIX, userMessage, technical)
  }
  setError(userMessage)
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const supabase = createClient()

  // So redireciona user comum para / (evita loop com admin layout no server)
  useEffect(() => {
    let cancelled = false
    async function redirectIfLoggedIn() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setCheckingAuth(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) {
        setCheckingAuth(false)
        return
      }
      const admin = await isAdminClient()
      if (cancelled) return
      if (admin) {
        setCheckingAuth(false)
        return
      }
      window.location.href = '/'
    }
    redirectIfLoggedIn()
    return () => { cancelled = true }
  }, [supabase])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') === 'access_denied') {
      setError('⚠️ Acesso negado. Você precisa ser um administrador para acessar o painel admin.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setLoginError(
          setError,
          'Supabase não configurado. Em produção: confira as variáveis de ambiente na Vercel. Em desenvolvimento: crie o arquivo .env.local.',
          { phase: 'config', error: 'Missing env vars' }
        )
        setLoading(false)
        return
      }

      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        })

        if (signUpError) {
          let userMsg = signUpError.message
          if (signUpError.message.includes('already registered')) userMsg = 'Este email já está cadastrado. Faça login ou use outro email.'
          else if (signUpError.message.includes('Invalid email')) userMsg = 'Email inválido. Verifique e tente novamente.'
          else if (signUpError.message.includes('Password')) userMsg = 'Senha muito fraca. Use pelo menos 6 caracteres.'
          else if (signUpError.message.includes('fetch') || signUpError.message.includes('network')) userMsg = 'Sem conexão com o servidor. Verifique sua internet ou se o Supabase está acessível.'
          setLoginError(setError, userMsg, { phase: 'signUp', error: signUpError })
          setLoading(false)
          return
        }

        if (data.user) {
          if (data.session) {
            window.location.href = '/'
            return
          } else {
            setError('✅ Conta criada! Verifique seu email para confirmar. Após confirmar, peça ao administrador para liberar seu acesso ao painel.')
            setTimeout(() => setIsSignUp(false), 5000)
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

        if (signInError) {
          const raw = signInError.message || ''
          let userMsg: string
          if (raw.includes('Invalid login credentials')) userMsg = 'Email ou senha incorretos. Verifique e tente novamente.'
          else if (raw.includes('Email not confirmed')) userMsg = 'Email ainda não confirmado. Verifique sua caixa de entrada e clique no link enviado.'
          else if (raw.includes('Database error') || raw.includes('querying schema') || raw.includes('500')) userMsg = 'Erro temporário no servidor (banco de dados). Tente de novo em alguns segundos. Se persistir, o administrador deve checar Supabase e variáveis na Vercel.'
          else if (raw.includes('fetch') || raw.includes('network')) userMsg = 'Sem conexão com o servidor. Verifique sua internet.'
          else userMsg = `Não foi possível entrar. (${raw.slice(0, 80)}${raw.length > 80 ? '…' : ''})`
          setLoginError(setError, userMsg, { phase: 'signIn', error: signInError, status: (signInError as any)?.status })
          setLoading(false)
          return
        }

        if (data.session) {
          const { data: adminCheck, error: adminError } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .maybeSingle()

          if (adminError) {
            const raw = adminError.message || ''
            let userMsg: string
            if (raw.includes('schema') || raw.includes('relation') || raw.includes('does not exist')) userMsg = 'Configuração do painel incompleta: tabela de administradores não encontrada no banco. O administrador do site precisa criar a tabela admin_users no Supabase.'
            else if (raw.includes('permission') || raw.includes('policy')) userMsg = 'Erro de permissão ao verificar administrador. O administrador do site deve conferir as políticas (RLS) da tabela admin_users no Supabase.'
            else userMsg = 'Erro ao verificar se você é administrador. Tente novamente; se continuar, o administrador deve checar Supabase (tabela admin_users) e variáveis na Vercel.'
            setLoginError(setError, userMsg, { phase: 'adminCheck', error: adminError, code: adminError.code })
            setLoading(false)
            return
          }

          if (adminCheck) {
            window.location.href = '/admin'
            return
          } else {
            window.location.href = '/'
            return
          }
        } else {
          setLoginError(setError, 'Sessão não foi criada. Tente fazer login novamente.', { phase: 'session', error: 'No session after signIn' })
          setLoading(false)
        }
      }
    } catch (err: unknown) {
      const ex = err as Error
      const msg = ex?.message || String(err)
      let userMsg: string
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('ERR_')) userMsg = 'Erro de conexão. Verifique sua internet e se o site está no ar.'
      else userMsg = 'Ocorreu um erro inesperado. Tente novamente ou contate o suporte.'
      setLoginError(setError, userMsg, { phase: 'catch', error: err })
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <p className="text-cyber-textDim">Carregando...</p>
      </div>
    )
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

