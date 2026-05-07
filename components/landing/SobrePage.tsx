'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, ArrowRight, MessageCircle } from 'lucide-react'
import { YUME_WHATSAPP } from '@/lib/constants'

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2.5, active = false): number {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.floor(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setCount(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return count
}

// ─── Utility: scroll-reveal wrapper ──────────────────────────────────────────
function SectionReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Utility: horizontal line reveal ─────────────────────────────────────────
function LineReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-px origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.4), transparent)' }}
      />
    </div>
  )
}

// ─── Stat card (red accents — "o sistema") ───────────────────────────────────
interface StatCardProps {
  value?: number
  suffix?: string
  formattedValue?: string
  label: string
  sub: string
  delay?: number
}

function StatCard({ value = 0, suffix = '', formattedValue, label, sub, delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCountUp(value, 2.5, inView && !formattedValue)
  const [hovered, setHovered] = useState(false)
  const display = formattedValue ?? (count.toLocaleString('pt-BR') + suffix)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative p-6 md:p-8 rounded-2xl border overflow-hidden cursor-default select-none
        transition-all duration-500
        border-red-500/20 bg-red-500/5
        hover:border-red-500/50 hover:bg-red-500/10
        hover:shadow-[0_0_40px_rgba(239,68,68,0.12)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="font-display font-black text-5xl md:text-6xl text-red-400 mb-2 tabular-nums leading-none">
        {display}
      </div>
      <div className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-3">
        {label}
      </div>
      <p className="text-white/50 text-sm leading-relaxed">
        {sub}
      </p>
      <motion.div
        className="absolute top-0 right-0"
        animate={{ opacity: hovered ? 1 : 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-0 right-0 w-px h-10 bg-gradient-to-b from-red-400/60 to-transparent" />
        <div className="absolute top-0 right-0 w-10 h-px bg-gradient-to-l from-red-400/60 to-transparent" />
      </motion.div>
    </motion.div>
  )
}

// ─── Process step (cyan accents — YUME) ──────────────────────────────────────
interface ProcessStepProps {
  number: string
  title: string
  description: string
  delay?: number
}

function ProcessStep({ number, title, description, delay = 0 }: ProcessStepProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative p-6 md:p-8 rounded-2xl border overflow-hidden cursor-default
        transition-all duration-500
        border-cyber-glow/15 bg-cyber-glow/5
        hover:border-cyber-glow/50 hover:bg-cyber-glow/10
        hover:shadow-[0_0_40px_rgba(0,255,255,0.10)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="font-display font-black text-7xl md:text-9xl leading-none mb-4 select-none transition-all duration-300"
        style={{
          WebkitTextStroke: hovered ? '1px rgba(0,255,255,0.45)' : '1px rgba(0,255,255,0.12)',
          color: 'transparent',
        }}
      >
        {number}
      </div>
      <h3
        className="font-display font-bold text-xl md:text-2xl mb-3 transition-colors duration-300"
        style={{ color: hovered ? 'rgb(0,255,255)' : 'white' }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed transition-colors duration-300"
        style={{ color: hovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.50)' }}
      >
        {description}
      </p>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)' }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// ─── Impact card ──────────────────────────────────────────────────────────────
function ImpactCard({
  value,
  suffix,
  formattedValue,
  label,
  sub,
  delay,
  inView,
}: {
  value: number
  suffix: string
  formattedValue?: string
  label: string
  sub: string
  delay: number
  inView: boolean
}) {
  const count = useCountUp(value, 2, inView && !formattedValue)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center p-6 rounded-xl border cursor-default
        border-cyber-glow/15 bg-cyber-glow/5
        hover:border-cyber-glow/40 hover:bg-cyber-glow/10 transition-all duration-300"
    >
      <div className="font-display font-black text-3xl md:text-4xl text-cyber-glow mb-1 tabular-nums">
        {formattedValue ?? (count.toLocaleString('pt-BR') + suffix)}
      </div>
      <div className="text-white/70 font-semibold text-sm mb-1">{label}</div>
      <div className="text-white/40 text-xs">{sub}</div>
    </motion.div>
  )
}

// ─── Impact section ───────────────────────────────────────────────────────────
function ImpactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const impacts = [
    { value: 5670, suffix: 'L', label: 'de água economizados', sub: 'por peça YUME' },
    { value: 3, suffix: ' calças', label: 'transformadas', sub: 'em 1 peça única' },
    { value: 0, suffix: '', formattedValue: 'ZERO', label: 'máquinas usadas', sub: 'tudo feito à mão' },
    { value: 0, suffix: '', formattedValue: 'ZERO', label: 'moldes', sub: 'cada peça é original' },
  ]

  return (
    <section className="py-24 px-4 border-t border-cyber-glow/10">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <SectionReveal className="text-center mb-16">
          <p className="text-cyber-glow/55 text-xs font-bold uppercase tracking-[0.3em] mb-4">
            O que cada peça representa
          </p>
          <h2
            className="font-display font-black text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Não é marketing. É conta de{' '}
            <span className="text-cyber-glow">matemática.</span>
          </h2>
        </SectionReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {impacts.map((item, i) => (
            <ImpactCard key={i} {...item} delay={i * 0.08} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Tech info accordion (substitui <details> com state controlado) ───────────
function TechInfoAccordion({ info }: { info: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer text-cyber-glow hover:text-cyber-glowAlt
          font-display text-sm uppercase tracking-wider
          transition-colors duration-300 flex items-center gap-2"
        type="button"
      >
        Info Técnica
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] leading-none"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-cyber-textDim text-sm leading-relaxed">
              {info}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SobrePage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  const whatsappHref = `https://wa.me/${YUME_WHATSAPP}?text=${encodeURIComponent(
    'Salve! Vi a página sobre a YUME e quero saber mais.'
  )}`

  return (
    <div className="bg-cyber-dark overflow-x-hidden">

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-cyber-dark/80 to-cyber-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(239,68,68,0.18),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,50,50,0.8) 2px,rgba(255,50,50,0.8) 3px)',
              backgroundSize: '100% 4px',
            }}
          />
        </motion.div>

        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              border border-red-500/30 bg-red-500/10 text-red-400
              text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Sobre a YUME
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="font-display font-black text-white leading-[0.95] mb-8"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            A moda é a segunda indústria{' '}
            <span className="text-red-400">mais poluente do planeta.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-xl md:text-2xl text-white/50 mb-3 font-light"
          >
            Atrás só do petróleo.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-lg text-white/35 font-light max-w-2xl mx-auto"
          >
            E toda temporada, te vendem o mesmo produto com um nome diferente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-20 flex flex-col items-center gap-2"
          >
            <span className="text-white/25 text-xs tracking-widest uppercase">continua</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-4 h-4 text-red-400/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. STATS ─────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <p className="text-red-400/60 text-xs font-bold uppercase tracking-[0.3em] mb-4">
              Os números que não aparecem na etiqueta
            </p>
            <h2
              className="font-display font-black text-white leading-tight mb-16"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              Você tem o direito de saber{' '}
              <span className="text-red-400">o que está comprando.</span>
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <StatCard
              value={92}
              suffix="M ton"
              label="de lixo têxtil por ano"
              sub="Mais do que o peso de toda a população humana na Terra. Jogado fora. Todo. Ano."
              delay={0}
            />
            <StatCard
              value={10}
              suffix="%"
              label="das emissões globais de carbono"
              sub="Mais que toda a aviação e o transporte marítimo juntos. Somados."
              delay={0.1}
            />
            <StatCard
              value={2700}
              suffix="L"
              label="de água por camiseta"
              sub="Uma única camiseta de algodão. Você bebe essa quantidade em quatro anos. Por uma peça."
              delay={0.2}
            />
            <StatCard
              formattedValue="< $1"
              label="por hora — a costureira"
              sub="A calça custa R$800 na prateleira. Você sabe de qual marca estamos falando. Talvez de mais de uma."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── 3. BRAND CALLOUT ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 border-y border-red-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionReveal>
            <p
              className="font-display font-bold text-white/80 leading-snug mb-6"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
            >
              Você conhece as marcas.{' '}
              <span className="text-white">Hyped, caras, com campanha bonita.</span>{' '}
              Feitas com pressa, jogadas fora na próxima temporada.
            </p>
            <p className="text-red-400/80 text-lg font-light">
              A etiqueta não conta essa parte.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── 4. TRANSITION ────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,255,255,0.06),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <LineReveal />
            <p className="text-cyber-textDim text-xs font-bold uppercase tracking-[0.35em] mb-8 mt-14">
              Existe uma outra forma
            </p>
            <h2
              className="font-display font-black text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              Em vez de criar mais lixo,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-glow to-cyber-glowAlt">
                transformar o que já existe.
              </span>
            </h2>
            <p className="text-white/45 text-lg md:text-xl font-light leading-relaxed">
              Não é romântico. Não é escala. Não é sistema.
              <br />
              É exatamente por isso que funciona.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── 5. PROCESS ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 bg-cyber-darker/40">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <p className="text-cyber-glow/55 text-xs font-bold uppercase tracking-[0.3em] mb-4">
              Como a YUME funciona
            </p>
            <h2
              className="font-display font-black text-white leading-tight mb-16"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              3 calças descartadas.{' '}
              <span className="text-cyber-glow">1 peça que não vai existir de novo.</span>
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <ProcessStep
              number="01"
              title="Garimpo"
              description="Calças descartadas viram matéria-prima. Sem mineração, sem plantio, sem extração. O mundo já produziu o suficiente."
              delay={0}
            />
            <ProcessStep
              number="02"
              title="Desconstrução"
              description="A peça é desmontada com cuidado. Cada parte avaliada, separada, respeitada. Nada é lixo — é vocabulário."
              delay={0.1}
            />
            <ProcessStep
              number="03"
              title="Reconstrução"
              description="À mão. Sem molde. Sem máquina. Sem pressa. O tempo que a indústria não tem é exatamente o tempo que a gente usa."
              delay={0.2}
            />
            <ProcessStep
              number="04"
              title="Identidade"
              description="O resultado nunca vai se repetir. Não por limitação — por design. Você não compra uma peça. Você adota uma."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── 6. CAMALEÃO ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

            <SectionReveal delay={0}>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden
                border border-cyber-glow/20 bg-cyber-darker">
                <Image
                  src="/images/camalas.jpg"
                  alt="Camaleão — fundador da YUME"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 pointer-events-none">
                  <div className="absolute top-0 left-0 w-px h-8 bg-cyber-glow/40" />
                  <div className="absolute top-0 left-0 w-8 h-px bg-cyber-glow/40" />
                </div>
                <div className="absolute bottom-4 right-4 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-px h-8 bg-cyber-glowAlt/40" />
                  <div className="absolute bottom-0 right-0 w-8 h-px bg-cyber-glowAlt/40" />
                </div>
              </div>
            </SectionReveal>

            {/* Text */}
            <SectionReveal delay={0.15} className="space-y-6">
              <div>
                <p className="text-cyber-glow/55 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                  O criador
                </p>
                <h2
                  className="font-display font-black text-white mb-1"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
                >
                  Camaleão
                </h2>
                <p className="text-cyber-textDim text-xs uppercase tracking-widest">
                  São Paulo · Fundador da YUME
                </p>
              </div>

              <div className="space-y-4 text-white/55 leading-relaxed">
                <p>
                  O Camaleão não criou mais uma marca de roupas.
                  Ele encontrou uma{' '}
                  <span className="text-white/85">resposta.</span>
                </p>
                <p>
                  Cada peça começa com uma pergunta:{' '}
                  <span className="text-cyber-glow italic">
                    &ldquo;O que acontece com as roupas que o mundo descartou?&rdquo;
                  </span>
                </p>
                <p>
                  A resposta é feita à mão. Sem molde. Sem fábrica. Sem cópia.
                  Cada peça YUME é um argumento contra a ideia de que moda
                  precisa ser{' '}
                  <span className="text-white/85">descartável para existir.</span>
                </p>
              </div>

              <div className="border-l-2 border-cyber-glow/30 pl-6">
                <p className="text-white/80 italic text-lg leading-relaxed">
                  &ldquo;A moda mais sustentável é a que já existe.
                  A gente só dá um novo propósito.&rdquo;
                </p>
                <p className="mt-3 text-cyber-textDim text-sm">— Camaleão, fundador</p>
              </div>
            </SectionReveal>

          </div>
        </div>
      </section>

      {/* ── 7. IMPACT ────────────────────────────────────────────────────── */}
      <ImpactSection />

      {/* ── 8. CTA ───────────────────────────────────────────────────────── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,255,255,0.07),transparent)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.018] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,255,1) 2px,rgba(0,255,255,1) 3px)',
            backgroundSize: '100% 4px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <SectionReveal>
            <p className="font-display font-black text-6xl text-cyber-glow/70 mb-6 select-none">
              夢
            </p>
            <h2
              className="font-display font-black text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              Agora você sabe de onde{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-glow to-cyber-glowAlt">
                veio cada peça.
              </span>
            </h2>
            <p className="text-white/45 text-lg mb-12 font-light">
              A coleção é pequena por design. Cada peça tem história.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-4 rounded-xl font-display font-bold text-base md:text-lg
                  bg-cyber-glow/20 border border-cyber-glow/50 text-cyber-glow
                  hover:bg-cyber-glow/30 hover:shadow-[0_0_30px_rgba(0,255,255,0.25)]
                  transition-all duration-300 flex items-center justify-center gap-2"
              >
                Ver a coleção
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl font-display font-bold text-base md:text-lg
                  bg-white/5 border border-white/15 text-white/65
                  hover:bg-white/10 hover:text-white hover:border-white/30
                  transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Falar com o Camaleão
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

    </div>
  )
}

