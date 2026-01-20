'use client'

import { motion } from 'framer-motion'
import { Category } from '@/lib/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CategoryNavigatorProps {
  categories: Category[]
}

export default function CategoryNavigator({ categories }: CategoryNavigatorProps) {
  const pathname = usePathname()

  return (
    // NOTE: fica abaixo do Header (Header já é sticky). Evita “duas barras” grudadas no topo.
    <nav className="relative z-40">
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide
        px-8 py-4
        bg-cyber-dark/95 backdrop-blur-xl border-b border-cyber-border shadow-lg">
        {/* All products link */}
        <Link href="/" className="block">
          <motion.div
            className={`
              px-6 py-3 rounded-lg
              font-display font-semibold text-sm uppercase tracking-wider
              transition-all duration-300
              whitespace-nowrap
              ${pathname === '/' 
                ? 'bg-cyber-glow/20 text-cyber-glow border border-cyber-glow/50' 
                : 'bg-cyber-light/30 text-cyber-textDim border border-cyber-border hover:bg-cyber-light/50 hover:text-cyber-text'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Todos
          </motion.div>
        </Link>

        {/* Category links */}
        {categories.map((category, index) => {
          const isActive = pathname === `/categoria/${category.slug}`
          return (
            <Link key={category.id} href={`/categoria/${category.slug}`}>
              <motion.div
                className={`
                  relative px-6 py-3 rounded-lg
                  font-display font-semibold text-sm uppercase tracking-wider
                  transition-all duration-300
                  whitespace-nowrap
                  ${isActive
                    ? 'bg-cyber-glow/20 text-cyber-glow border border-cyber-glow/50'
                    : 'bg-cyber-light/30 text-cyber-textDim border border-cyber-border hover:bg-cyber-light/50 hover:text-cyber-text'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {category.name}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-cyber-glow/10 blur-xl"
                    layoutId="activeCategory"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

