'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronDown, Zap, Droplets } from 'lucide-react'
import { Category } from '@/lib/types'

interface HeroSectionProps {
  totalProducts: number
  categories: Category[]
}

export default function HeroSection({ totalProducts, categories }: HeroSectionProps) {
  const scrollToCollection = () => {
    document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Background: imagem real com blur pesado ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/products/camisa-gengar.jpg"
          alt=""
          fill
          className="object-cover scale-110"
          style={{ filter: 'blur(40px)', opacity: 0.25 }}
          priority
          aria-hidden
        />
        <div className="absolute inset-0 bg-cyber-dark/80" />
        {/* Gradiente radial cyan */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(0,255,255,0.08),transparent)]" />
        {/* Gradiente radial magenta */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(255,0,255,0.07),transparent)]" />
      </div>

      {/* ── Scanlines ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,255,1) 2px,rgba(0,255,255,1) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* ── Grain ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── 夢 decorativo gigante ── */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[30vw] font-black text-cyber-glow/[0.04] leading-none"
          style={{ fontFamily: 'serif' }}
        >
          夢
        </span>
      </div>

      {/* ── Conteúdo principal ── */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">

        {/* Tag */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full
            border border-cyber-glow/30 bg-cyber-glow/5 text-cyber-glow
            text-xs font-semibold tracking-widest uppercase mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-glow animate-pulse" />
          São Paulo · Upcycling · Feito à mão
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1 className="font-display font-black leading-none tracking-tight mb-2">
            <span
              className="block text-[18vw] sm:text-[14vw] md:text-[11rem]
                text-transparent bg-clip-text
                bg-gradient-to-r from-cyber-glow via-white to-cyber-glowAlt"
            >
              YUME
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl tracking-[0.4em] text-cyber-textDim font-light mt-1">
              ATELIER
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl text-cyber-text/80 font-light mt-6 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Feito à mão.{' '}
          <span className="text-cyber-glow">Sem máquina.</span>{' '}
          Sem igual.
        </motion.p>

        {/* Impact badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
            bg-cyber-light/30 border border-cyber-border backdrop-blur-sm
            text-cyber-textDim text-sm">
            <Zap className="w-3.5 h-3.5 text-cyber-glow flex-shrink-0" />
            <span>{totalProducts} peça{totalProducts !== 1 ? 's' : ''} únicas disponíveis</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
            bg-cyber-light/30 border border-cyber-border backdrop-blur-sm
            text-cyber-textDim text-sm">
            <Droplets className="w-3.5 h-3.5 text-cyber-glow flex-shrink-0" />
            <span>Cada peça economiza +5.000L de água</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={scrollToCollection}
          className="group relative inline-flex items-center gap-3
            px-8 py-4 rounded-xl
            bg-cyber-glow/15 border border-cyber-glow/50
            text-cyber-glow font-display font-bold text-base tracking-wide
            hover:bg-cyber-glow/25 hover:border-cyber-glow hover:shadow-glow
            transition-all duration-300"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Ver coleção
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </motion.button>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-cyber-glow/60 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* ── Elementos flutuantes decorativos ── */}
      <div className="absolute top-1/4 left-6 w-24 h-24 rounded-full border border-cyber-glow/10 blur-2xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-8 w-32 h-32 rounded-full border border-cyber-glowAlt/10 blur-2xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
    </section>
  )
}
