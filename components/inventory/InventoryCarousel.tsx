'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import ProductFocus from './ProductFocus'

interface InventoryCarouselProps {
  products: Product[]
  whatsappNumber?: string
  categoryBackground?: string
  onProductChange?: (product: Product) => void
}

const CIRCLE_RADIUS = 280
const ITEMS_IN_CIRCLE = 6

export default function InventoryCarousel({
  products,
  whatsappNumber,
  categoryBackground,
  onProductChange,
}: InventoryCarouselProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const safeProducts = Array.isArray(products) ? products : []
  const hasProducts = safeProducts.length > 0

  const focusedProduct = hasProducts ? safeProducts[focusedIndex] ?? safeProducts[0] : undefined
  const circleProducts = safeProducts
    .filter((_, i) => i !== focusedIndex)
    .slice(0, ITEMS_IN_CIRCLE)

  const handleNext = useCallback(() => {
    setFocusedIndex((prev) => (prev + 1) % safeProducts.length)
  }, [safeProducts.length])

  const handlePrevious = useCallback(() => {
    setFocusedIndex((prev) => (prev - 1 + safeProducts.length) % safeProducts.length)
  }, [safeProducts.length])

  // Navegação por teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrevious()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handlePrevious])

  useEffect(() => {
    if (hasProducts && onProductChange && focusedProduct) {
      onProductChange(focusedProduct)
    }
  }, [focusedIndex, focusedProduct, hasProducts, onProductChange])

  const getCirclePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2
    return {
      x: Math.cos(angle) * CIRCLE_RADIUS,
      y: Math.sin(angle) * CIRCLE_RADIUS,
    }
  }

  // Background: imagem do produto em foco (fallback: categoria)
  const bgImage = focusedProduct?.image_urls?.[0] ?? categoryBackground

  if (!hasProducts) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold text-cyber-glow">YUME Atelier</h1>
          <p className="text-cyber-textDim text-lg">Nenhum produto disponível no momento.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[calc(100svh-57px)] overflow-hidden">

      {/* Background dinâmico — muda com o produto em foco */}
      <AnimatePresence mode="wait">
        <motion.div
          key={focusedProduct?.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {bgImage && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{ backgroundImage: `url(${bgImage})`, filter: 'blur(60px)' }}
            />
          )}
          <div className="absolute inset-0 bg-cyber-dark/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/50 via-transparent to-cyber-dark/90" />
        </motion.div>
      </AnimatePresence>

      {/* Grain */}
      <div
        className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cards circulares — só desktop */}
      <div className="absolute inset-0 z-30 pointer-events-none hidden md:block">
        {circleProducts.map((product, index) => {
          const { x, y } = getCirclePosition(index, circleProducts.length)
          return (
            <motion.div
              key={product.id}
              className="absolute pointer-events-auto"
              style={{ left: '50%', top: '50%', x: x - 96, y: y - 128 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.55, scale: 0.7, filter: 'blur(3px)' }}
              whileHover={{ opacity: 1, scale: 0.82, filter: 'blur(0px)', zIndex: 40 }}
              transition={{ duration: 0.35 }}
              onClick={() => {
                const actual = safeProducts.findIndex((p) => p.id === product.id)
                if (actual !== -1) setFocusedIndex(actual)
              }}
            >
              <ProductCard product={product} variant="minimal" />
            </motion.div>
          )
        })}
      </div>

      {/* Produto em foco — scrollável no mobile, centralizado no desktop */}
      <div className="absolute inset-0 z-20 overflow-y-auto md:overflow-hidden flex items-start md:items-center justify-center">
        <div className="w-full pt-4 pb-20 md:py-0">
          <AnimatePresence mode="wait">
            {focusedProduct && (
              <motion.div
                key={focusedProduct.id}
                initial={{ opacity: 0, scale: 0.92, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.92, rotateY: 10 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <ProductFocus
                  product={focusedProduct}
                  phoneNumber={whatsappNumber}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Seta esquerda */}
      <motion.button
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40
          w-10 h-10 sm:w-14 sm:h-14 rounded-full
          bg-cyber-dark/60 border border-cyber-border backdrop-blur-md
          flex items-center justify-center
          text-cyber-glow hover:text-cyber-glowAlt hover:bg-cyber-dark/80
          transition-colors"
        onClick={handlePrevious}
        whileTap={{ scale: 0.9 }}
        aria-label="Produto anterior"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Seta direita */}
      <motion.button
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40
          w-10 h-10 sm:w-14 sm:h-14 rounded-full
          bg-cyber-dark/60 border border-cyber-border backdrop-blur-md
          flex items-center justify-center
          text-cyber-glow hover:text-cyber-glowAlt hover:bg-cyber-dark/80
          transition-colors"
        onClick={handleNext}
        whileTap={{ scale: 0.9 }}
        aria-label="Próximo produto"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Dots de navegação */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex gap-1.5">
        {safeProducts.map((_, index) => (
          <button
            key={index}
            aria-label={`Ir para produto ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === focusedIndex
                ? 'bg-cyber-glow w-6'
                : 'bg-cyber-text/25 w-1.5 hover:bg-cyber-text/50'
            }`}
            onClick={() => setFocusedIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
