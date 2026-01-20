'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Product, ProductStatus } from '@/lib/types'
import { ShoppingBag } from 'lucide-react'
import { useState, useRef } from 'react'
import Skeleton from '@/components/ui/Skeleton'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'minimal'
  onAddToCart?: (product: Product) => void
  onOpenModal?: (product: Product) => void
}

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  available: {
    label: 'Disponível',
    className: 'text-green-400',
  },
  sold_out: {
    label: 'Sold Out',
    className: 'text-red-400',
  },
  made_to_order: {
    label: 'Sob Encomenda',
    className: 'text-cyber-glow',
  },
}

export default function ProductCard({ 
  product, 
  variant = 'default', 
  onAddToCart,
  onOpenModal 
}: ProductCardProps) {
  const statusInfo = statusConfig[product.status]
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleClick = () => {
    if (onOpenModal) {
      onOpenModal(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToCart && product.status === 'available') {
      onAddToCart(product)
    }
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        className="relative w-48 h-64 rounded-lg overflow-hidden
          border border-cyber-border/30
          bg-cyber-darker/50 backdrop-blur-sm
          cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
      >
        {product.image_urls?.[0] && !imageError ? (
          <>
            {!imageLoaded && (
              <Skeleton className="absolute inset-0" />
            )}
            <Image
              src={product.image_urls[0]}
              alt={product.name || 'Produto'}
              fill
              className={`object-cover opacity-70 group-hover:opacity-100 transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              unoptimized
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true)
                setImageLoaded(true)
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cyber-textDim text-xs">
            Sem imagem
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-xs text-cyber-text font-display truncate">{product.name}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
    >
      <motion.div 
        className="relative aspect-[3/4] rounded-lg overflow-hidden
          border border-cyber-border/50
          bg-cyber-darker"
        style={{
          transform: 'translateZ(20px)',
        }}
      >
        {product.image_urls?.[0] && !imageError ? (
          <>
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 z-10" />
            )}
            <motion.div
              className="absolute inset-0"
              style={{
                transform: 'translateZ(30px)',
              }}
            >
              <Image
                src={product.image_urls[0]}
                alt={product.name || 'Produto'}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-125 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                unoptimized
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  setImageLoaded(true)
                }}
              />
            </motion.div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cyber-textDim">
            Sem imagem
          </div>
        )}
        
        {/* Parallax blur overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyber-glow/0 via-transparent to-cyber-glowAlt/0
            group-hover:from-cyber-glow/20 group-hover:to-cyber-glowAlt/20
            transition-all duration-700"
          style={{
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)',
          }}
          animate={{
            backdropFilter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-cyber-glow/0 group-hover:bg-cyber-glow/10 transition-all duration-500"
          style={{
            boxShadow: '0 0 0px rgba(0,255,255,0)',
          }}
          animate={{
            boxShadow: [
              '0 0 0px rgba(0,255,255,0)',
              '0 0 30px rgba(0,255,255,0.3)',
              '0 0 0px rgba(0,255,255,0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Status badge */}
        <motion.div 
          className={`
            absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-display font-semibold
            backdrop-blur-md border z-20
            ${statusInfo.className} border-current/30 bg-cyber-dark/50
          `}
          style={{
            transform: 'translateZ(40px)',
          }}
        >
          {statusInfo.label}
        </motion.div>
      </motion.div>

      {/* Product info */}
      <motion.div 
        className="mt-4 space-y-1"
        style={{
          transform: 'translateZ(10px)',
        }}
      >
        <h3 className="text-lg font-display font-semibold text-cyber-text group-hover:text-cyber-glow transition-colors">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-sm text-cyber-textDim uppercase tracking-wider">
            {product.category.name}
          </p>
        )}
        {product.price && (
          <p className="text-cyber-glow font-display font-bold">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        )}
        {onAddToCart && product.status === 'available' && (
          <motion.button
            onClick={handleAddToCart}
            className="mt-3 w-full px-4 py-2 rounded-lg
              bg-cyber-glow/20 border border-cyber-glow/50
              text-cyber-glow font-display font-semibold text-sm
              hover:bg-cyber-glow/30 hover:shadow-glow transition-all
              flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag className="w-4 h-4" />
            Adicionar ao Carrinho
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

