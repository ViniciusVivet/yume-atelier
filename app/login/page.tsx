'use client'

import { useState, useEffect } from 'react'
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

  // Verificar se há erro na URL (ex: acesso negado)
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
          // Conta criada - NÃO dá acesso admin automaticamente
          // Usuário precisa ser adicionado à tabela admin_users pelo admin
          if (data.session) {
            // Se já tem sessão (sem confirmação de email), redireciona para home
            router.push('/')
            router.refresh()
          } else {
            setError('✅ Conta criada! Verifique seu email para confirmar. Após confirmar, entre em contato com o administrador para obter acesso ao painel admin.')
            setTimeout(() => {
              setIsSignUp(false)
            }, 5000)
          }
        }
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          let errorMessage = signInError.message
          
          // Traduzir erros comuns
          if (signInError.message.includes('Invalid login credentials')) {
            errorMessage = 'Email ou senha incorretos. Verifique e tente novamente.'
          } else if (signInError.message.includes('Email not confirmed')) {
            errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
          } else if (signInError.message.includes('fetch') || signInError.message.includes('network')) {
            errorMessage = 'Erro de conexão. Verifique se o Supabase está configurado corretamente no .env.local e reinicie o servidor.'
          }
          
          setError(errorMessage)
          setLoading(false)
          return
        }

        if (data.session) {
          // Verificar se é admin antes de redirecionar
          const { data: adminCheck } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .maybeSingle()

          if (adminCheck) {
            // É admin - redireciona para admin
            router.push('/admin')
            router.refresh()
          } else {
            // Não é admin - redireciona para home
            router.push('/')
            router.refresh()
          }
        } else {
          setError('Erro: sessão não criada. Tente novamente.')
          setLoading(false)
        }
      }
    } catch (err: any) {
      console.error('Erro completo:', err)
      let errorMessage = 'Erro ao processar. '
      
      if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        errorMessage += 'Erro de conexão com Supabase. Verifique:\n'
        errorMessage += '1. O arquivo .env.local existe e tem as variáveis corretas\n'
        errorMessage += '2. Reinicie o servidor (Ctrl+C e depois npm run dev)\n'
        errorMessage += '3. Verifique se a URL do Supabase está correta'
      } else {
        errorMessage += err.message || 'Erro desconhecido'
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

