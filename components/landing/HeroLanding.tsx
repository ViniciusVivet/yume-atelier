'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeroLandingProps {
  hasProducts: boolean
}

export default function HeroLanding({ hasProducts }: HeroLandingProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cyber-dark">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,255,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
        {/* Hero section */}
        <div className="text-center space-y-8 max-w-4xl">
          {/* Main title with glow effect */}
          <motion.h1 
            className="text-8xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-glow via-cyber-glowAlt to-cyber-glow"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient 3s ease infinite',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            YUME
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold text-cyber-text uppercase tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ATELIER
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-cyber-textDim font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Moda Disruptiva • Peças Únicas • Arte em Tecido
          </motion.p>

          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/admin"
              className="group relative px-8 py-4 rounded-lg
                bg-cyber-glow/20 border-2 border-cyber-glow/50
                backdrop-blur-md
                text-cyber-glow font-display font-bold text-lg uppercase tracking-wider
                transition-all duration-300
                hover:bg-cyber-glow/30 hover:border-cyber-glow hover:shadow-glow-lg hover:scale-105
                overflow-hidden"
            >
              <span className="relative z-10">Painel Admin</span>
              <div className="absolute inset-0 bg-cyber-glow/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            {!hasProducts && (
              <div className="px-8 py-4 rounded-lg
                bg-cyber-light/10 border border-cyber-border/50
                backdrop-blur-sm
                text-cyber-textDim text-sm
                max-w-md">
                <p className="font-semibold text-cyber-text mb-1">Drop em breve.</p>
                <p className="text-left text-xs leading-relaxed">
                  Catálogo em construção. Enquanto isso, você pode entrar no Admin e cadastrar as peças.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-cyber-glow/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-cyber-glowAlt/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  )
}

