'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { generateWhatsAppLink } from '@/lib/utils/whatsapp'
import { Product } from '@/lib/types'

interface WhatsAppCTAProps {
  product: Product
  phoneNumber: string
  messageTemplate?: string
  className?: string
}

export default function WhatsAppCTA({
  product,
  phoneNumber,
  messageTemplate,
  className = '',
}: WhatsAppCTAProps) {
  const whatsappLink = generateWhatsAppLink(phoneNumber, product.name, messageTemplate)

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative flex items-center justify-center gap-3
        px-8 py-4 rounded-lg
        bg-cyber-glow/10 border border-cyber-glow/30
        backdrop-blur-md
        text-cyber-text font-display font-semibold text-lg
        transition-all duration-300
        hover:bg-cyber-glow/20 hover:border-cyber-glow/50
        hover:shadow-glow hover:scale-105
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-cyber-glow/20 blur-xl opacity-0 group-hover:opacity-100"
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <MessageCircle className="w-6 h-6 text-cyber-glow" />
      <span className="relative z-10">
        {product.status === 'sold_out' ? 'Consultar Disponibilidade' : 'Fazer Pedido'}
      </span>
      
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-cyber-glow"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  )
}

