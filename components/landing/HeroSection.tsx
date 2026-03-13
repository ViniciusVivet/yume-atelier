'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'framer-motion'
import { Zap, Droplets } from 'lucide-react'
import { Category, HeroType, HeroMediaItem } from '@/lib/types'
import Image from 'next/image'

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
  heroType?: HeroType
  heroMediaUrls?: HeroMediaItem[]
  heroCarouselInterval?: number
  heroVideoStart?: number | null
  heroVideoEnd?: number | null
  heroVideoLoop?: boolean
}

// ─── Background renderers ─────────────────────────────────────────────────────

function GradientBg({ bgY }: { bgY: MotionValue<string> }) {
  return (
    <motion.div className="absolute inset-0 z-0 scale-125 will-change-transform" style={{ y: bgY }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/products/camisa-gengar.jpg)',
          filter: 'blur(35px)',
          opacity: 0.3,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/60 via-cyber-dark/70 to-cyber-dark/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_40%,rgba(5,5,5,0.8)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,255,255,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_90%,rgba(255,0,255,0.08),transparent)]" />
    </motion.div>
  )
}

function ImageBg({ url, bgY }: { url: string; bgY: MotionValue<string> }) {
  return (
    <motion.div className="absolute inset-0 z-0 scale-110 will-change-transform" style={{ y: bgY }}>
      <Image src={url} alt="" fill className="object-cover" unoptimized priority />
      <div className="absolute inset-0 bg-cyber-dark/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/30 via-transparent to-cyber-dark/80" />
    </motion.div>
  )
}

function VideoBg({
  url,
  loop,
  videoStart,
  videoEnd,
}: {
  url: string
  loop: boolean
  videoStart?: number | null
  videoEnd?: number | null
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (videoStart != null) video.currentTime = videoStart

    const handleTimeUpdate = () => {
      if (!video) return
      if (videoEnd != null && video.currentTime >= videoEnd) {
        if (loop) {
          video.currentTime = videoStart ?? 0
        } else {
          video.pause()
        }
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [url, videoStart, videoEnd, loop])

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        src={url}
        autoPlay
        muted
        playsInline
        loop={loop && videoEnd == null}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-cyber-dark/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/30 via-transparent to-cyber-dark/80" />
    </div>
  )
}

function CarouselBg({
  items,
  interval,
  bgY,
}: {
  items: HeroMediaItem[]
  interval: number
  bgY: MotionValue<string>
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const duration = (items[index]?.duration ?? interval) * 1000
    const timer = setTimeout(() => setIndex((prev) => (prev + 1) % items.length), duration)
    return () => clearTimeout(timer)
  }, [index, items, interval])

  const current = items[index]
  if (!current) return <GradientBg bgY={bgY} />

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {current.type === 'image' ? (
            <Image src={current.url} alt="" fill className="object-cover" unoptimized />
          ) : (
            <video
              src={current.url}
              autoPlay muted playsInline loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-cyber-dark/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/30 via-transparent to-cyber-dark/80" />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HeroSection({
  totalProducts,
  heroType = 'gradient',
  heroMediaUrls = [],
  heroCarouselInterval = 5,
  heroVideoStart,
  heroVideoEnd,
  heroVideoLoop = true,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const kanjiY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const firstUrl = heroMediaUrls[0]?.url ?? ''

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[58vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background baseado no tipo ────────────────────────────────────── */}
      {heroType === 'gradient' && <GradientBg bgY={bgY} />}
      {heroType === 'image' && firstUrl && <ImageBg url={firstUrl} bgY={bgY} />}
      {heroType === 'image' && !firstUrl && <GradientBg bgY={bgY} />}
      {heroType === 'video' && firstUrl && (
        <VideoBg url={firstUrl} loop={heroVideoLoop} videoStart={heroVideoStart} videoEnd={heroVideoEnd} />
      )}
      {heroType === 'video' && !firstUrl && <GradientBg bgY={bgY} />}
      {heroType === 'carousel' && heroMediaUrls.length > 0 && (
        <CarouselBg items={heroMediaUrls} interval={heroCarouselInterval} bgY={bgY} />
      )}
      {heroType === 'carousel' && heroMediaUrls.length === 0 && <GradientBg bgY={bgY} />}

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

          {/* Título com glitch */}
          <motion.div variants={item}>
            <h1 className="font-display font-black leading-none tracking-tight mb-3">
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
