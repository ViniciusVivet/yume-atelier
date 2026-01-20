'use client'

import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import ProductCard from '@/components/inventory/ProductCard'

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  onOpenModal?: (product: Product) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function ProductGrid({ products, onAddToCart, onOpenModal }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-cyber-textDim text-lg">
            Nenhum produto disponível no momento.
          </p>
          <p className="text-cyber-textDim text-sm">
            Em breve teremos novidades!
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard 
            product={product} 
            onAddToCart={onAddToCart}
            onOpenModal={onOpenModal}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

