'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import { Product } from '@/lib/types'

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
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

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
                        <img
                          src={item.image_urls[0]}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded border border-cyber-border"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-cyber-text mb-1">
                          {item.name}
                        </h3>
                        <p className="text-cyber-glow font-bold mb-2">
                          R$ {(item.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded border border-cyber-border hover:bg-cyber-light transition-colors"
                          >
                            -
                          </button>
                          <span className="text-cyber-text w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded border border-cyber-border hover:bg-cyber-light transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="ml-auto p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-cyber-border p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-cyber-textDim">Total:</span>
                  <span className="font-display font-bold text-cyber-glow text-xl">
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {whatsappNumber && cart.length > 0 && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá! Tenho interesse nas seguintes peças do YUME Atelier:\n\n${cart.map((item) => 
                        `• ${item.name} (${item.quantity}x) - R$ ${((item.price || 0) * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      ).join('\n')}\n\nTotal: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3 rounded-lg
                      bg-cyber-glow/20 border border-cyber-glow/50
                      backdrop-blur-md
                      text-cyber-glow font-display font-semibold
                      hover:bg-cyber-glow/30 hover:shadow-glow transition-all
                      flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Finalizar Pedido via WhatsApp
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

