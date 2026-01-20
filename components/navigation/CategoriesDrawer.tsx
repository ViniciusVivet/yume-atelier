'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useCategories } from '@/contexts/CategoriesContext'
import { usePathname } from 'next/navigation'

export default function CategoriesDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { categories } = useCategories()
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-sm z-[220]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed left-0 top-0 h-full w-full sm:w-96 bg-cyber-light border-r border-cyber-border z-[230] flex flex-col shadow-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-cyber-border">
              <div>
                <p className="text-cyber-glow font-display font-bold text-xl">Categorias</p>
                <p className="text-cyber-textDim text-xs">Explore como inventário</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cyber-darker transition-colors"
                aria-label="Fechar categorias"
              >
                <X className="w-5 h-5 text-cyber-textDim" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              <Link
                href="/"
                onClick={onClose as any}
                className={`block rounded-lg border p-4 transition-colors ${
                  pathname === '/'
                    ? 'border-cyber-glow/50 bg-cyber-glow/10'
                    : 'border-cyber-border bg-cyber-darker hover:bg-cyber-light/40'
                }`}
              >
                <p className="font-display font-semibold text-cyber-text">Todos</p>
                <p className="text-xs text-cyber-textDim">Ver o catálogo completo</p>
              </Link>

              {categories.map((c) => {
                const active = pathname === `/categoria/${c.slug}`
                return (
                  <Link
                    key={c.id}
                    href={`/categoria/${c.slug}`}
                    onClick={onClose as any}
                    className={`block rounded-lg border p-4 transition-colors ${
                      active
                        ? 'border-cyber-glow/50 bg-cyber-glow/10'
                        : 'border-cyber-border bg-cyber-darker hover:bg-cyber-light/40'
                    }`}
                  >
                    <p className="font-display font-semibold text-cyber-text">{c.name}</p>
                    {c.description && <p className="text-xs text-cyber-textDim mt-1">{c.description}</p>}
                  </Link>
                )
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}


