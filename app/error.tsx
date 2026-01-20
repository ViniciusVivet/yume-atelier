'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="text-center space-y-6 max-w-2xl px-8">
        <h1 className="text-5xl font-display font-bold text-red-400 mb-4">
          Erro
        </h1>
        <p className="text-cyber-textDim text-lg">
          Algo deu errado. Por favor, tente novamente.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
            text-cyber-glow font-display font-semibold
            hover:bg-cyber-glow/30 hover:shadow-glow transition-all"
        >
          Tentar Novamente
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-cyber-textDim text-sm">
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className="mt-2 p-4 bg-cyber-darker rounded text-xs text-red-400 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

