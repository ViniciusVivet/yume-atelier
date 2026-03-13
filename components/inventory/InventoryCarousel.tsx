'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Product, ProductStatus } from '@/lib/types'

interface InventoryCarouselProps {
  products: Product[]
  whatsappNumber?: string
  categoryBackground?: string
  onProductChange?: (product: Product) => void
}

const statusConfig: Record<ProductStatus, { label: string; color: string }> = {
  available: { label: 'Disponível', color: 'text-green-400 border-green-400/30 bg-green-400/10' },
  sold_out: { label: 'Sold Out', color: 'text-red-400 border-red-400/30 bg-red-400/10' },
  made_to_order: { label: 'Encomenda', color: 'text-cyber-glow border-cyber-glow/30 bg-cyber-glow/10' },
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const status = statusConfig[product.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/produto/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden
          border border-cyber-border/40
          bg-cyber-darker
          group-hover:border-cyber-glow/40
          group-hover:shadow-[0_0_20px_rgba(0,255,255,0.12)]
          transition-all duration-300">

          {product.image_urls?.[0] ? (
            <Image
              src={product.image_urls[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyber-textDim text-xs">
              Sem imagem
            </div>
          )}

          {/* Status badge */}
          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full
            border backdrop-blur-md text-[10px] font-semibold ${status.color}`}>
            {status.label}
          </div>
        </div>

        {/* Info abaixo da imagem */}
        <div className="mt-2.5 px-0.5">
          <h3 className="text-sm font-display font-semibold text-cyber-text
            group-hover:text-cyber-glow transition-colors duration-200 leading-snug truncate">
            {product.name}
          </h3>
          {product.price ? (
            <p className="mt-0.5 text-cyber-glow font-bold text-sm">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ) : null}
        </div>
      </Link>
    </motion.div>
  )
}

export default function InventoryCarousel({ products }: InventoryCarouselProps) {
  const safeProducts = Array.isArray(products) ? products : []

  if (safeProducts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-cyber-textDim">Nenhum produto disponível no momento.</p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {safeProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  )
}
