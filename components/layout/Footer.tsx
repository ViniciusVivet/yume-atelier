import Link from 'next/link'
import { Instagram, MessageCircle } from 'lucide-react'

const YUME_WHATSAPP = '5511986765219'
const INSTAGRAM_URL = 'https://instagram.com/sp.yume'

export default function Footer() {
  return (
    <footer className="relative border-t border-cyber-border overflow-hidden">

      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/yume-atelier.jpg)' }}
      />
      {/* Dark overlay — mantém legibilidade independente do tema */}
      <div className="absolute inset-0 bg-black/72" />

      <div className="relative container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand — esquerda */}
        <div className="text-center md:text-left">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <span className="font-display font-black text-cyber-glow group-hover:text-cyber-glowAlt transition-colors text-lg">
              夢 YUME
            </span>
          </Link>
          <p className="text-white/60 text-xs max-w-xs">
            Moda upcycled feita à mão em São Paulo.<br />
            Zero desperdício. Zero igual.
          </p>
        </div>

        {/* Direita: botões + crédito */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-white/80 hover:text-white hover:border-white/40
                transition-colors text-sm backdrop-blur-sm"
              aria-label="Instagram @sp.yume"
            >
              <Instagram className="w-4 h-4" />
              @sp.yume
            </a>
            <a
              href={`https://wa.me/${YUME_WHATSAPP}?text=${encodeURIComponent('Salve! Vim pelo site do YUME e quero saber sobre as peças.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-cyber-glow/15 border border-cyber-glow/40
                text-cyber-glow hover:bg-cyber-glow/25
                transition-colors text-sm backdrop-blur-sm"
              aria-label="WhatsApp YUME"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          {/* Credit */}
          <p className="text-white/30 text-xs tracking-widest uppercase whitespace-nowrap">
            SITE BY{' '}
            <span className="text-cyber-glow/50 font-semibold">ORBITAMOS</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
