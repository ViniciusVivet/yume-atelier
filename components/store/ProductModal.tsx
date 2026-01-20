'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Product } from '@/lib/types'
import ProductFocus from '@/components/inventory/ProductFocus'
import Portal from '@/components/ui/Portal'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  phoneNumber?: string
  messageTemplate?: string
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  phoneNumber,
  messageTemplate,
}: ProductModalProps) {
  if (!product) return null

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-cyber-dark/95 backdrop-blur-xl z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
              className="fixed inset-0 z-[210] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="fixed top-6 right-6 z-[220] w-12 h-12 rounded-full
                  bg-cyber-dark/80 border border-cyber-border
                  flex items-center justify-center
                  text-cyber-text hover:text-cyber-glow hover:border-cyber-glow
                  transition-all duration-300 hover:scale-110 backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Product Content */}
              <div className="min-h-screen py-16 px-4">
                <ProductFocus
                  product={product}
                  phoneNumber={phoneNumber}
                  messageTemplate={messageTemplate}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}

