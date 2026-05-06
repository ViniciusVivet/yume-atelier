'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Product } from '@/lib/types'
import WhatsAppCTA from '../ui/WhatsAppCTA'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { ShoppingBag, X } from 'lucide-react'
import { statusConfig } from '@/lib/utils/product-status'

interface ProductFocusProps {
  product: Product
  phoneNumber?: string
  messageTemplate?: string
}

export default function ProductFocus({
  product,
  phoneNumber = '',
  messageTemplate,
}: ProductFocusProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [techOpen, setTechOpen] = useState(false)
  const { addToCart } = useCart()
  const statusInfo = statusConfig[product.status]

  const handleAddToCart = () => {
    if (product.status === 'available') {
      addToCart(product)
    }
  }

  const images = product.image_urls || []
  const activeImage = images[activeIndex] || images[0]

  return (
    <motion.div
      className="relative max-w-4xl mx-auto px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main product display */}
      <div className="relative">
        {/* Hero image/video */}
        <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-6
          border border-cyber-border/50
          bg-cyber-darker">
          {product.hero_video_url ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={product.hero_video_url} type="video/mp4" />
            </video>
          ) : activeImage ? (
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute inset-0"
              aria-label="Abrir zoom da imagem"
              type="button"
            >
              <Image
                src={activeImage}
                alt={product.name || 'Produto'}
                fill
                className="object-cover"
                priority
                unoptimized
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyber-textDim">
              Sem imagem
            </div>
          )}
          
          {/* Status badge */}
          <motion.div
            className={`
              absolute top-4 right-4 px-4 py-2 rounded-full
              border backdrop-blur-md font-display text-sm font-semibold
              ${statusInfo.className}
              ${product.status === 'sold_out' ? 'animate-glitch' : ''}
            `}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {statusInfo.label}
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-cyber-glow/10 blur-3xl opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && !product.hero_video_url && (
          <div className="grid grid-cols-5 gap-3 mb-8">
            {images.slice(0, 5).map((url, idx) => {
              const active = idx === activeIndex
              return (
                <button
                  key={url + idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border transition-colors ${
                    active ? 'border-cyber-glow/60' : 'border-cyber-border hover:border-cyber-glow/30'
                  }`}
                  type="button"
                  aria-label={`Selecionar imagem ${idx + 1}`}
                >
                  <Image src={url} alt="" fill className="object-cover" unoptimized />
                  {active && <div className="absolute inset-0 bg-cyber-glow/10" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Product info */}
        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-cyber-text mb-2">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-cyber-textDim text-sm uppercase tracking-wider">
                {product.category.name}
              </p>
            )}
          </div>

          {product.artistic_description && (
            <p className="text-cyber-text/80 text-lg leading-relaxed">
              {product.artistic_description}
            </p>
          )}

          {product.description && (
            <p className="text-cyber-textDim leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Technical info (collapsible) */}
          {product.technical_info && (
            <div>
              <button
                type="button"
                onClick={() => setTechOpen((o) => !o)}
                className="flex items-center gap-2 text-cyber-glow hover:text-cyber-glowAlt
                  font-display text-sm uppercase tracking-wider transition-colors duration-300"
              >
                Info Técnica
                <motion.span
                  animate={{ rotate: techOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] leading-none"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {techOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-cyber-textDim text-sm leading-relaxed">
                      {product.technical_info}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Price */}
          {product.price && (
            <div className="text-2xl font-display font-bold text-cyber-glow">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          )}

          {/* Add to Cart Button (only for available products) */}
          {product.status === 'available' && (
            <motion.button
              onClick={handleAddToCart}
              className="mt-4 px-6 py-3 rounded-lg
                bg-cyber-glow/20 border border-cyber-glow/50
                backdrop-blur-md
                text-cyber-glow font-display font-semibold text-lg
                hover:bg-cyber-glow/30 hover:shadow-glow transition-all
                flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBag className="w-5 h-5" />
              Adicionar ao Carrinho
            </motion.button>
          )}

          {/* WhatsApp CTA */}
          {phoneNumber && (
            <div className="pt-4">
              <WhatsAppCTA
                product={product}
                phoneNumber={phoneNumber}
                messageTemplate={messageTemplate}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Zoom / Lightbox */}
      <AnimatePresence>
        {isZoomOpen && activeImage && (
          <>
            <motion.div
              className="fixed inset-0 bg-cyber-dark/90 backdrop-blur-sm z-[160]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-[170] flex items-center justify-center p-6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="relative w-full max-w-5xl aspect-[4/3] rounded-2xl overflow-hidden border border-cyber-border bg-cyber-darker">
                <Image src={activeImage} alt={product.name || 'Produto'} fill className="object-contain" unoptimized />
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-cyber-dark/70 border border-cyber-border text-cyber-text hover:bg-cyber-dark transition-colors"
                  aria-label="Fechar zoom"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

