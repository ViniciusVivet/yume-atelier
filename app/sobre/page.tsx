import type { Metadata } from 'next'
import SobrePage from '@/components/landing/SobrePage'

export const metadata: Metadata = {
  title: 'Sobre | YUME Atelier',
  description:
    'A moda é a segunda indústria mais poluente do planeta. Conheça a história do Camaleão e por que a YUME existe.',
  openGraph: {
    title: 'Sobre a YUME',
    description:
      'A moda é a segunda indústria mais poluente do planeta. A YUME transforma o que o mundo descartou.',
  },
}

export default function SobreRoute() {
  return <SobrePage />
}
