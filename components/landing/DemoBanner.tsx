'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DemoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mt-6 rounded-xl border border-cyber-glow/30 bg-cyber-glow/5 backdrop-blur-md p-4"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-cyber-glow font-display font-semibold">
            Modo demonstração (catálogo exemplo)
          </p>
          <p className="text-cyber-textDim text-sm">
            Esses produtos são apenas para você validar o visual e o fluxo. Para criar os reais, entre no Admin.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/seed"
            className="px-4 py-2 rounded-lg bg-cyber-glow/20 border border-cyber-glow/40 text-cyber-glow hover:bg-cyber-glow/30 transition-colors text-sm font-semibold"
          >
            Criar produtos de teste
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg bg-cyber-light/30 border border-cyber-border text-cyber-text hover:bg-cyber-light/50 transition-colors text-sm"
          >
            Abrir Admin
          </Link>
        </div>
      </div>
    </motion.div>
  )
}


