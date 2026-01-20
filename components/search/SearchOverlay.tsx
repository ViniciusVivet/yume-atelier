'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type StatusFilter = 'all' | 'available' | 'sold_out' | 'made_to_order'

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const params = useSearchParams()

  const initialQ = params.get('q') || ''
  const initialStatus = (params.get('status') as StatusFilter) || 'all'

  const [q, setQ] = useState(initialQ)
  const [status, setStatus] = useState<StatusFilter>(initialStatus)

  useEffect(() => {
    if (isOpen) {
      setQ(initialQ)
      setStatus(initialStatus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const chips: Array<{ label: string; value: StatusFilter }> = useMemo(
    () => [
      { label: 'Tudo', value: 'all' },
      { label: 'Disponível', value: 'available' },
      { label: 'Sold out', value: 'sold_out' },
      { label: 'Encomenda', value: 'made_to_order' },
    ],
    []
  )

  const apply = () => {
    const next = new URLSearchParams(params.toString())
    if (q.trim()) next.set('q', q.trim())
    else next.delete('q')

    if (status !== 'all') next.set('status', status)
    else next.delete('status')

    router.push(`/?${next.toString()}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-sm z-[240]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[250] flex items-start justify-center p-6 pt-24"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="w-full max-w-2xl rounded-2xl border border-cyber-border bg-cyber-darker/95 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-cyber-border">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-cyber-glow" />
                  <p className="font-display font-bold text-cyber-text">Buscar peças</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-cyber-light/30 transition-colors"
                  aria-label="Fechar busca"
                >
                  <X className="w-5 h-5 text-cyber-textDim" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') apply()
                  }}
                  placeholder="Ex: blusa, balaclava, jeans..."
                  className="w-full px-4 py-3 rounded-lg bg-cyber-dark border border-cyber-border text-cyber-text
                    focus:outline-none focus:border-cyber-glow transition-colors"
                />

                <div className="flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setStatus(c.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-display uppercase tracking-wider border transition-colors ${
                        status === c.value
                          ? 'border-cyber-glow/50 bg-cyber-glow/10 text-cyber-glow'
                          : 'border-cyber-border bg-cyber-light/20 text-cyber-textDim hover:bg-cyber-light/30'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setQ('')
                      setStatus('all')
                    }}
                    className="px-4 py-2 rounded-lg bg-cyber-light/20 border border-cyber-border text-cyber-textDim hover:bg-cyber-light/30 transition-colors text-sm"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={apply}
                    className="px-4 py-2 rounded-lg bg-cyber-glow/20 border border-cyber-glow/40 text-cyber-glow hover:bg-cyber-glow/30 transition-colors text-sm font-semibold"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


