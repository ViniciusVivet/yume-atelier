'use client'

import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'

interface StoreHeroProps {
  categories: Category[]
}

export default function StoreHero({ categories }: StoreHeroProps) {
  const router = useRouter()
  const params = useSearchParams()

  const setStatus = (status?: string) => {
    const next = new URLSearchParams(params.toString())
    if (status) next.set('status', status)
    else next.delete('status')
    router.push(`/?${next.toString()}`)
  }

  const newDropCategory = categories.find(cat => cat.slug === 'novo-drop')
  const uniquePiecesCategory = categories.find(cat => cat.slug === 'pecas-unicas')

  return (
    <section className="container mx-auto px-8 py-16">
      <motion.h2
        className="text-5xl font-display font-bold text-cyber-text text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Destaques YUME
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Novo Drop */}
        <motion.div
          className="relative aspect-video md:aspect-[3/4] rounded-lg overflow-hidden
            border border-cyber-border/50 bg-cyber-darker group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,255,0.3)' }}
        >
          <Link href="/?status=available">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c23b?w=800&q=80"
              alt="Novo Drop"
              fill
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-3xl font-display font-bold text-cyber-glow group-hover:text-cyber-glowAlt transition-colors">
                Novo Drop
              </h3>
              <p className="text-cyber-textDim text-sm">Peças recém-chegadas</p>
            </div>
          </Link>
        </motion.div>

        {/* Card 2: Disponível */}
        <motion.div
          className="relative aspect-video md:aspect-[3/4] rounded-lg overflow-hidden
            border border-cyber-border/50 bg-cyber-darker group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,0,255,0.3)' }}
        >
          <Link href="/?status=available">
            <Image
              src="https://images.unsplash.com/photo-1581044777550-4cfa607037dc?w=800&q=80"
              alt="Disponível"
              fill
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-3xl font-display font-bold text-cyber-glowAlt group-hover:text-cyber-glow transition-colors">
                Disponível
              </h3>
              <p className="text-cyber-textDim text-sm">Pronta entrega</p>
            </div>
          </Link>
        </motion.div>

        {/* Card 3: Sob Encomenda */}
        <motion.div
          className="relative aspect-video md:aspect-[3/4] rounded-lg overflow-hidden
            border border-cyber-border/50 bg-cyber-darker group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,255,0.3)' }}
        >
          <Link href="/?status=made_to_order">
            <Image
              src="https://images.unsplash.com/photo-1551028150-64b9f39646e2?w=800&q=80"
              alt="Sob Encomenda"
              fill
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-3xl font-display font-bold text-cyber-glow group-hover:text-cyber-glowAlt transition-colors">
                Sob Encomenda
              </h3>
              <p className="text-cyber-textDim text-sm">Peças personalizadas</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


