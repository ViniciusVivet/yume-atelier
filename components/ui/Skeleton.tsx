'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'rect' | 'circle' | 'text'
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const baseClasses = variant === 'circle' 
    ? 'rounded-full' 
    : variant === 'text' 
    ? 'rounded' 
    : 'rounded-lg'

  return (
    <motion.div
      className={`bg-cyber-darker/50 ${baseClasses} ${className}`}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

