'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, ShoppingBag, Grid3X3, Search, Instagram, MessageCircle, LayoutDashboard } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { isAdminClient } from '@/lib/utils/admin'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import CartSidebar from '@/components/store/CartSidebar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import CategoriesDrawer from '@/components/navigation/CategoriesDrawer'
import SearchOverlay from '@/components/search/SearchOverlay'
import Portal from '@/components/ui/Portal'
import { cn } from '@/lib/utils/cn'

const YUME_WHATSAPP = '5511986765219'
const INSTAGRAM_URL = 'https://instagram.com/sp.yume'

function HeaderContent() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart()
  const { settings } = useSiteSettings()

  const checkSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAdmin(session ? await isAdminClient() : false)
    } catch {
      setIsAdmin(false)
    }
  }, [supabase])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return
    checkSession()
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkSession())
      return () => subscription.unsubscribe()
    } catch (err) {
      console.error('Error setting up auth listener:', err)
    }
  }, [checkSession, supabase])

  const handleLogout = async () => {
    try { await supabase.auth.signOut() } catch {}
    setIsAdmin(false)
    router.push('/')
    router.refresh()
  }

  const isAdminPage = pathname?.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login' || pathname === '/login'
  const whatsappHref = `https://wa.me/${(settings?.whatsapp_number || YUME_WHATSAPP).replace(/\D/g, '')}?text=${encodeURIComponent('Salve! Vim pelo site do YUME e quero saber sobre as peças.')}`

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-500 relative',
        scrolled ? 'border-cyber-glow/20' : 'border-transparent'
      )}
      style={{
        background: scrolled ? 'rgba(10,10,10,0.82)' : 'rgba(10,10,10,0.1)',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(6px)',
      }}
    >
      {/* Grid cyberpunk transparente */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.045) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: scrolled ? 1 : 0.4,
        }}
      />
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="YUME — ir para a home">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              bg-cyber-glow/10 border border-cyber-glow/30
              text-cyber-glow group-hover:text-cyber-glowAlt group-hover:border-cyber-glowAlt/40
              transition-colors font-display font-black text-base"
            title="夢 (Yume) = Sonho"
          >
            夢
          </span>
          <span className="font-display font-bold text-cyber-text group-hover:text-cyber-glow transition-colors tracking-wide">
            YUME
          </span>
        </Link>

        {/* ── Loja pública ── */}
        {!isAdminPage && !isLoginPage && (
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Categorias — ícone no mobile, texto no desktop */}
            <button
              onClick={() => setIsCategoriesOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-cyber-light/20 border border-cyber-border
                text-cyber-text hover:bg-cyber-light/30 transition-colors
                flex items-center gap-2 text-sm font-semibold"
              aria-label="Categorias"
            >
              <Grid3X3 className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Categorias</span>
            </button>

            {/* Buscar — ícone no mobile, texto no desktop */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-cyber-light/20 border border-cyber-border
                text-cyber-text hover:bg-cyber-light/30 transition-colors
                flex items-center gap-2 text-sm font-semibold"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Buscar</span>
            </button>

            {/* Instagram — visível em todos os tamanhos */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-cyber-light/20 border border-cyber-border
                text-cyber-text hover:bg-cyber-light/30 transition-colors"
              aria-label="Instagram @sp.yume"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* WhatsApp — visível em todos os tamanhos */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-cyber-glow/15 border border-cyber-glow/30
                text-cyber-glow hover:bg-cyber-glow/25 transition-colors"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Carrinho */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:px-3 sm:py-2 rounded-lg
                bg-cyber-glow/20 border border-cyber-glow/50
                text-cyber-glow hover:bg-cyber-glow/30 transition-colors
                flex items-center gap-2 text-sm font-semibold"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full
                  bg-cyber-glowAlt text-cyber-dark text-[10px] font-bold
                  flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin logado: Painel + Sair */}
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg
                    bg-cyber-glow/20 border border-cyber-glow/50
                    text-cyber-glow hover:bg-cyber-glow/30 transition-colors text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Painel
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-cyber-light/30 border border-cyber-border
                    text-cyber-textDim hover:text-cyber-text hover:bg-cyber-light/50 transition-colors"
                  aria-label="Sair"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Painel admin ── */}
        {isAdminPage && !isLoginPage && (
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg bg-cyber-light/30 border border-cyber-border
                text-cyber-text hover:bg-cyber-light/50 transition-colors text-sm"
            >
              Ver Loja
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-cyber-light/30 border border-cyber-border
                text-cyber-textDim hover:text-cyber-text hover:bg-cyber-light/50 transition-colors"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Overlays */}
      {!isAdminPage && !isLoginPage && (
        <Portal>
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            whatsappNumber={settings?.whatsapp_number || ''}
            whatsappTemplate={settings?.whatsapp_message_template}
          />
          <CategoriesDrawer isOpen={isCategoriesOpen} onClose={() => setIsCategoriesOpen(false)} />
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Portal>
      )}
    </header>
  )
}

export default function Header() {
  return (
    <ErrorBoundary
      fallback={
        <header
          className="sticky top-0 z-50 border-b border-cyber-glow/20 relative"
          style={{
            background: 'rgba(10,10,10,0.82)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,255,0.045) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.045) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="container mx-auto px-4 py-3 relative z-10">
            <Link href="/" className="font-display font-bold text-cyber-text">YUME</Link>
          </div>
        </header>
      }
    >
      <HeaderContent />
    </ErrorBoundary>
  )
}
