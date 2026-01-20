'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { Product, Category } from '@/lib/types'
import CartSidebar from './CartSidebar'
import ProductGrid from './ProductGrid'
import ProductModal from './ProductModal'
import { useCart } from '@/contexts/CartContext'
import { useSearchParams } from 'next/navigation'
import StoreHero from './StoreHero'

interface CartItem extends Product {
  quantity: number
}

interface StoreLayoutProps {
  products: Product[]
  categories: Category[]
  whatsappNumber?: string
  whatsappTemplate?: string
  isDemoMode?: boolean
}

export default function StoreLayout({
  products,
  categories,
  whatsappNumber,
  whatsappTemplate,
  isDemoMode = false,
}: StoreLayoutProps) {
  const { cart, addToCart, removeFromCart, updateQuantity, cartCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('q') || ''
  const filterStatus = searchParams.get('status') || ''
  const filterCategorySlug = searchParams.get('category') || ''

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filterCategorySlug) {
      filtered = filtered.filter(p => p.category?.slug === filterCategorySlug);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.artistic_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    return filtered;
  }, [products, searchQuery, filterStatus, filterCategorySlug]);

  // Get current category for background
  const currentCategory = useMemo(() => {
    if (filterCategorySlug) {
      return categories.find(c => c.slug === filterCategorySlug);
    }
    return null;
  }, [categories, filterCategorySlug]);

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setIsCartOpen(true)
  }

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        {currentCategory?.background_image_url && (
          <motion.div
            key={currentCategory.id}
            className="fixed inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentCategory.background_image_url})`,
                filter: 'blur(40px)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <motion.button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-30 w-16 h-16 rounded-full
          bg-cyber-glow/20 border-2 border-cyber-glow/50
          backdrop-blur-md
          flex items-center justify-center
          text-cyber-glow hover:bg-cyber-glow/30 hover:shadow-glow-lg
          transition-all duration-300 hover:scale-110
          shadow-2xl"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 0px rgba(0,255,255,0.3)',
            '0 0 30px rgba(0,255,255,0.5)',
            '0 0 0px rgba(0,255,255,0.3)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <motion.span
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full
                bg-cyber-glowAlt text-cyber-dark text-xs font-bold
                flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {cartCount}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 pb-24">
        <StoreHero categories={categories} />
        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={handleAddToCart}
          onOpenModal={handleOpenModal}
        />
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        whatsappNumber={whatsappNumber}
        whatsappTemplate={whatsappTemplate}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
        phoneNumber={whatsappNumber}
        messageTemplate={whatsappTemplate}
      />
    </div>
  )
}

