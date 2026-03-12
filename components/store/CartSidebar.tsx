'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ShoppingBag, Trash2, MessageCircle } from 'lucide-react'
import { Product } from '@/lib/types'

// Fallback: usado quando o número não está configurado no Supabase
const YUME_WHATSAPP = '5511986765219'

interface CartItem extends Product {
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onRemoveItem: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  whatsappNumber?: string
  whatsappTemplate?: string
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  whatsappNumber,
  whatsappTemplate,
}: CartSidebarProps) {
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)
  const phone = (whatsappNumber || YUME_WHATSAPP).replace(/\D/g, '')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-sm z-[260]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-cyber-light border-l border-cyber-border z-[270] flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyber-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-cyber-glow" />
                <h2 className="text-xl font-display font-bold text-cyber-text">
                  Carrinho
                </h2>
                {cart.length > 0 && (
                  <span className="px-2 py-1 rounded-full bg-cyber-glow/20 text-cyber-glow text-xs font-semibold">
                    {cart.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cyber-darker transition-colors"
              >
                <X className="w-5 h-5 text-cyber-textDim" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag className="w-16 h-16 text-cyber-textDim/30" />
                  <p className="text-cyber-textDim">Seu carrinho está vazio</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-cyber-darker rounded-lg p-4 border border-cyber-border"
                  >
                    <div className="flex gap-4">
                      {item.image_urls?.[0] && (
                        <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border border-cyber-border">
                          <Image
                            src={item.image_urls[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-cyber-text mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-cyber-glow font-bold">
                          {item.price
                            ? `R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            : 'Consultar'}
                        </p>
                        <p className="text-cyber-textDim text-xs mt-1">Peça única</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="self-start p-1.5 text-cyber-textDim hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        aria-label="Remover do carrinho"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-cyber-border p-6 space-y-4">
                {total > 0 && (
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-cyber-textDim">Total estimado:</span>
                    <span className="font-display font-bold text-cyber-glow text-xl">
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <a
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(
                    `Salve! Tenho interesse nas seguintes peças do YUME:\n\n${cart.map((item) =>
                      `• ${item.name}${item.price ? ` — R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}`
                    ).join('\n')}\n\nQuero saber sobre disponibilidade e como comprar!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-4 rounded-lg
                    bg-green-500/20 border border-green-500/50
                    text-green-400 font-display font-bold text-lg
                    hover:bg-green-500/30 transition-all
                    flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Comprar via WhatsApp
                </a>
                <p className="text-cyber-textDim text-xs text-center">
                  Você será redirecionado para o WhatsApp do Camaleão
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

