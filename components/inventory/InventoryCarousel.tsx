'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import ProductFocus from './ProductFocus'

interface InventoryCarouselProps {
  products: Product[]
  categoryBackground?: string
  onProductChange?: (product: Product) => void
}

const CIRCLE_RADIUS = 300 // Radius of the circular arrangement
const ITEMS_IN_CIRCLE = 6 // Number of items around the center

export default function InventoryCarousel({
  products,
  categoryBackground,
  onProductChange,
}: InventoryCarouselProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Safety check: ensure products is an array
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4 z-50">
          <h1 className="text-4xl font-display font-bold text-cyber-glow mb-4">
            YUME Atelier
          </h1>
          <p className="text-cyber-textDim text-lg">
            Nenhum produto disponível no momento.
          </p>
        </div>
      </div>
    )
  }

  const focusedProduct = products[focusedIndex] || products[0]
  const circleProducts = products.filter((_, index) => index !== focusedIndex).slice(0, ITEMS_IN_CIRCLE)

  useEffect(() => {
    if (onProductChange && focusedProduct) {
      onProductChange(focusedProduct)
    }
  }, [focusedIndex, focusedProduct, onProductChange])

  const handleNext = () => {
    setFocusedIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrevious = () => {
    setFocusedIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleProductClick = (index: number) => {
    // Find the actual index in the original products array
    const actualIndex = products.findIndex((p) => p.id === circleProducts[index]?.id)
    if (actualIndex !== -1) {
      setFocusedIndex(actualIndex)
    }
  }

  // Calculate positions for circular arrangement
  const getCirclePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2 // Start from top
    const x = Math.cos(angle) * CIRCLE_RADIUS
    const y = Math.sin(angle) * CIRCLE_RADIUS
    return { x, y, angle }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background with blur effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={focusedProduct?.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {categoryBackground && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${categoryBackground})` }}
            />
          )}
          <div className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/60 via-transparent to-cyber-dark/80" />
        </motion.div>
      </AnimatePresence>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Center focused product */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {focusedProduct && (
            <motion.div
              key={focusedProduct.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <ProductFocus product={focusedProduct} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Circular arrangement of other products */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {circleProducts.map((product, index) => {
          const { x, y } = getCirclePosition(index, circleProducts.length)
          return (
            <motion.div
              key={product.id}
              className="absolute pointer-events-auto"
              style={{
                left: '50%',
                top: '50%',
                x: x - 100, // Center the card (assuming card width ~200px)
                y: y - 150, // Center the card (assuming card height ~300px)
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 0.6,
                scale: 0.7,
                filter: 'blur(4px)',
              }}
              whileHover={{ 
                opacity: 1,
                scale: 0.85,
                filter: 'blur(0px)',
                zIndex: 40,
              }}
              transition={{ duration: 0.4 }}
              onClick={() => handleProductClick(index)}
            >
              <ProductCard product={product} variant="minimal" />
            </motion.div>
          )
        })}
      </div>

      {/* Navigation arrows */}
      <motion.button
        className="absolute left-8 top-1/2 -translate-y-1/2 z-40
          w-16 h-16 rounded-full
          bg-cyber-light/50 border border-cyber-border
          backdrop-blur-md
          flex items-center justify-center
          text-cyber-glow hover:text-cyber-glowAlt
          transition-all duration-300
          hover:bg-cyber-light/70 hover:scale-110
          hover:shadow-glow
          pointer-events-auto"
        onClick={handlePrevious}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        className="absolute right-8 top-1/2 -translate-y-1/2 z-40
          w-16 h-16 rounded-full
          bg-cyber-light/50 border border-cyber-border
          backdrop-blur-md
          flex items-center justify-center
          text-cyber-glow hover:text-cyber-glowAlt
          transition-all duration-300
          hover:bg-cyber-light/70 hover:scale-110
          hover:shadow-glow
          pointer-events-auto"
        onClick={handleNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Product indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === focusedIndex 
                ? 'bg-cyber-glow w-8 shadow-glow' 
                : 'bg-cyber-text/30 hover:bg-cyber-text/50'
              }
            `}
            onClick={() => setFocusedIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

