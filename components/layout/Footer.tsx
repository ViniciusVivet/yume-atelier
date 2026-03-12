import Link from 'next/link'
import { Instagram, MessageCircle } from 'lucide-react'

const YUME_WHATSAPP = '5511986765219'
const INSTAGRAM_URL = 'https://instagram.com/sp.yume'

export default function Footer() {
  return (
    <footer className="border-t border-cyber-border bg-cyber-darker">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="text-center md:text-left">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <span className="font-display font-black text-cyber-glow group-hover:text-cyber-glowAlt transition-colors text-lg">
              夢 YUME
            </span>
          </Link>
          <p className="text-cyber-textDim text-xs max-w-xs">
            Moda upcycled feita à mão em São Paulo.<br />
            Zero desperdício. Zero igual.
          </p>
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg
              bg-cyber-light/20 border border-cyber-border
              text-cyber-text hover:text-cyber-glow hover:border-cyber-glow/40
              transition-colors text-sm"
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
              bg-cyber-glow/10 border border-cyber-glow/30
              text-cyber-glow hover:bg-cyber-glow/20
              transition-colors text-sm"
            aria-label="WhatsApp YUME"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>

        {/* Credit */}
        <div className="text-center md:text-right">
          <p className="text-cyber-textDim/50 text-xs tracking-widest uppercase">
            SITE BY{' '}
            <span className="text-cyber-glow/60 font-semibold">ORBITAMOS</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
