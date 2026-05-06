import { ProductStatus } from '@/lib/types'

export const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  available: {
    label: 'Disponível',
    className: 'text-green-400 border-green-400/30 bg-green-400/10',
  },
  sold_out: {
    label: 'Sold Out',
    className: 'text-red-400 border-red-400/30 bg-red-400/10',
  },
  made_to_order: {
    label: 'Sob Encomenda',
    className: 'text-cyber-glow border-cyber-glow/30 bg-cyber-glow/10',
  },
}
