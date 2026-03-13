'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Home, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { isAdminClient } from '@/lib/utils/admin'

const EMAIL_STORAGE_KEY = 'yume-login-email'

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
  const [showPassword, setShowPassword] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(true)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const supabase = createClient()

  // Restaurar email salvo (lembrar de mim)
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(EMAIL_STORAGE_KEY) : null
      if (saved) setEmail(saved)
    } catch {}
  }, [])

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
          if (rememberEmail && email) {
            try { localStorage.setItem(EMAIL_STORAGE_KEY, email) } catch {}
          }
          if (data.session) {
            setError('✅ Conta criada! Você já está logado e pode usar o site. O painel administrativo é restrito a administradores.')
            setLoading(false)
            setTimeout(() => { window.location.href = '/' }, 1500)
            return
          } else {
            setError('✅ Conta criada! Verifique seu email e clique no link para confirmar. Depois você pode entrar normalmente. O painel admin é restrito a quem for liberado pelo administrador.')
            setTimeout(() => setIsSignUp(false), 6000)
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

        if (signInError) {
          const raw = signInError.message || ''
          let userMsg: string
          if (raw.includes('Invalid login credentials')) userMsg = 'Email ou senha incorretos. Verifique e tente novamente.'
          else if (raw.includes('Email not confirmed')) userMsg = 'Email ainda não confirmado. Verifique sua caixa de entrada e clique no link enviado.'
          else if (raw.includes('Database error') || raw.includes('querying schema') || raw.includes('500')) userMsg = 'Erro temporario no servidor (banco de dados). Tente de novo em alguns segundos. Se persistir, o administrador deve checar Supabase e variaveis na Vercel.'
          else if (raw.includes('fetch') || raw.includes('network')) userMsg = 'Sem conexao com o servidor. Na Vercel: confira variaveis de ambiente. No Supabase: Authentication -> URL Configuration -> adicione a URL do site (ex: https://yume-atelier.vercel.app).'
          else userMsg = `Nao foi possivel entrar. (${raw.slice(0, 80)}${raw.length > 80 ? '…' : ''})`
          setLoginError(setError, userMsg, { phase: 'signIn', error: signInError, status: (signInError as any)?.status })
          setLoading(false)
          return
        }

        if (data.session) {
          if (rememberEmail && email) {
            try { localStorage.setItem(EMAIL_STORAGE_KEY, email) } catch {}
          }
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
            setLoading(false)
            setTimeout(() => { window.location.href = '/admin' }, 150)
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
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('ERR_')) userMsg = 'Erro de conexao. Na Vercel confira variaveis de ambiente. No Supabase: Authentication -> URL Configuration -> adicione a URL do site.'
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

          {forgotPassword ? (
            <div className="space-y-4">
              <p className="text-cyber-textDim text-sm">
                Digite seu email e enviaremos um link para redefinir a senha.
              </p>
              <div>
                <label className="block text-sm font-semibold text-cyber-text mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                    text-cyber-text focus:outline-none focus:border-cyber-glow"
                  placeholder="seu@email.com"
                />
              </div>
              {resetSent ? (
                <p className="text-green-400 text-sm">Link enviado! Verifique seu email (e a pasta de spam).</p>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) return
                    setLoading(true)
                    setError('')
                    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/login?reset=1`,
                    })
                    setLoading(false)
                    if (err) setError(err.message)
                    else setResetSent(true)
                  }}
                  disabled={loading || !email}
                  className="w-full px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50 text-cyber-glow font-semibold hover:bg-cyber-glow/30 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              )}
              <button
                type="button"
                onClick={() => { setForgotPassword(false); setResetSent(false); setError('') }}
                className="w-full text-cyber-textDim hover:text-cyber-glow text-sm"
              >
                Voltar ao login
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-cyber-text mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-textDim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                    text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyber-text mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-textDim" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-cyber-darker border border-cyber-border
                    text-cyber-text focus:outline-none focus:border-cyber-glow transition-colors"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-textDim hover:text-cyber-glow transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-cyber-textDim hover:text-cyber-text">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="rounded border-cyber-border bg-cyber-darker text-cyber-glow focus:ring-cyber-glow"
                />
                Lembrar meu email
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => { setForgotPassword(true); setError('') }}
                  className="text-sm text-cyber-textDim hover:text-cyber-glow transition-colors"
                >
                  Esqueci a senha
                </button>
              )}
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
          )}
        </div>
      </div>
    </div>
  )
}

