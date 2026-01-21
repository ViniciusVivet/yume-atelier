'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Toast as ToastType, useToast } from '@/contexts/ToastContext'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  toast: ToastType
  onRemove: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    icon: 'text-green-400',
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    icon: 'text-red-400',
  },
  warning: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    icon: 'text-yellow-400',
  },
  info: {
    bg: 'bg-cyber-glow/20',
    border: 'border-cyber-glow/50',
    text: 'text-cyber-glow',
    icon: 'text-cyber-glow',
  },
}

export default function Toast({ toast, onRemove }: ToastProps) {
  const Icon = icons[toast.type]
  const colorScheme = colors[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm
        ${colorScheme.bg} ${colorScheme.border}
        min-w-[300px] max-w-[500px]
        shadow-lg
      `}
    >
      <Icon className={`w-5 h-5 ${colorScheme.icon} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm font-medium ${colorScheme.text}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className={`
          flex-shrink-0 p-1 rounded hover:bg-black/20 transition-colors
          ${colorScheme.text}
        `}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
