'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap, Droplets } from 'lucide-react'
import { Category } from '@/lib/types'

// ─── Variants de entrada staggered ───────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

interface HeroSectionProps {
  totalProducts: number
  categories: Category[]
}

export default function HeroSection({ totalProducts }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax: rastreia o progresso de scroll da seção
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Background sobe 35% mais devagar que o scroll → efeito parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  // Kanji flutua na direção oposta → ilusão de profundidade
  const kanjiY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  // Conteúdo principal sobe 20% → sai de cena suavemente
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  // Fade out do conteúdo ao scrollar
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[58vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background com parallax ───────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0 scale-125 will-change-transform"
        style={{ y: bgY }}
      >
        {/* Imagem real da YUME como bg */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/products/camisa-gengar.jpg)',
            filter: 'blur(35px)',
            opacity: 0.3,
          }}
        />
        {/* Overlay escuro com gradiente multicamada */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/60 via-cyber-dark/70 to-cyber-dark/95" />
        {/* Vinheta nas bordas */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_40%,rgba(5,5,5,0.8)_100%)]" />
        {/* Radial cyan (topo) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,255,255,0.1),transparent)]" />
        {/* Radial magenta (base direita) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_90%,rgba(255,0,255,0.08),transparent)]" />
      </motion.div>

      {/* ── Scanlines ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,255,1) 2px,rgba(0,255,255,1) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* ── Grain ─────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── 夢 gigante flutuante com parallax ─────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none"
        style={{ y: kanjiY }}
        aria-hidden
      >
        <motion.span
          className="font-black leading-none"
          style={{
            fontFamily: 'serif',
            fontSize: 'clamp(100px, 28vw, 300px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(0,255,255,0.07)',
            textShadow: '0 0 80px rgba(0,255,255,0.04)',
          }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
            textShadow: [
              '0 0 80px rgba(0,255,255,0.04)',
              '0 0 120px rgba(0,255,255,0.09)',
              '0 0 80px rgba(0,255,255,0.04)',
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          夢
        </motion.span>
      </motion.div>

      {/* ── Conteúdo principal ────────────────────────────────────────────── */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-3xl mx-auto"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div variants={container} initial="hidden" animate="show">

          {/* Tag de origem */}
          <motion.div variants={item} className="mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              border border-cyber-glow/30 bg-cyber-glow/5 text-cyber-glow
              text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-glow animate-pulse" />
              São Paulo · Upcycling · Feito à mão
            </span>
          </motion.div>

          {/* Título com glitch ────────────────────────────────────────────── */}
          <motion.div variants={item}>
            <h1 className="font-display font-black leading-none tracking-tight mb-3">

              {/* YUME — glitch intermitente a cada ~5s */}
              <motion.span
                className="block text-[13vw] sm:text-[10vw] md:text-[6rem]
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-cyber-glow via-white to-cyber-glowAlt
                  select-none"
                animate={{
                  x: [0, 0, 0, 0, -4, 5, -2, 3, 0, 0, 0, 0],
                  filter: [
                    'none', 'none', 'none', 'none',
                    'drop-shadow(5px 0 #ff00ff) drop-shadow(-5px 0 #00ffff)',
                    'drop-shadow(-4px 0 #ff00ff) drop-shadow(4px 0 #00ffff)',
                    'drop-shadow(3px 0 #ff00ff)',
                    'none',
                    'none', 'none', 'none', 'none',
                  ],
                }}
                transition={{
                  duration: 6,
                  times: [0, 0.3, 0.5, 0.62, 0.65, 0.68, 0.71, 0.75, 0.8, 0.85, 0.9, 1],
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                YUME
              </motion.span>

              {/* ATELIER — aparece logo abaixo */}
              <motion.span
                className="block text-xs sm:text-base md:text-lg tracking-[0.5em]
                  text-cyber-textDim font-light mt-1"
                animate={{
                  opacity: [0.6, 0.9, 0.6],
                  letterSpacing: ['0.5em', '0.55em', '0.5em'],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                ATELIER
              </motion.span>
            </h1>
          </motion.div>

          {/* Tagline + badges inline */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-2 mt-2"
          >
            <p className="text-sm sm:text-base text-cyber-text/70 font-light">
              Feito à mão.{' '}
              <span className="text-cyber-glow font-normal">Sem máquina.</span>{' '}
              Sem igual.
            </p>
            <span className="text-cyber-textDim/30">·</span>
            <span className="inline-flex items-center gap-1.5 text-cyber-textDim text-xs">
              <Zap className="w-3 h-3 text-cyber-glow flex-shrink-0" />
              {totalProducts} peça{totalProducts !== 1 ? 's' : ''} únicas
            </span>
            <span className="text-cyber-textDim/30">·</span>
            <span className="inline-flex items-center gap-1.5 text-cyber-textDim text-xs">
              <Droplets className="w-3 h-3 text-cyber-glow flex-shrink-0" />
              +5.000L economizados por peça
            </span>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* ── Orbs decorativos ──────────────────────────────────────────────── */}
      <div className="absolute top-1/3 left-4 w-16 h-16 rounded-full bg-cyber-glow/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-4 w-20 h-20 rounded-full bg-cyber-glowAlt/5 blur-3xl pointer-events-none" />
    </section>
  )
}
