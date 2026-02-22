'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, ShoppingBag, Grid3X3, Search, Instagram, MessageCircle, LayoutDashboard } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { isAdminClient } from '@/lib/utils/admin'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import CartSidebar from '@/components/store/CartSidebar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import CategoriesDrawer from '@/components/navigation/CategoriesDrawer'
import SearchOverlay from '@/components/search/SearchOverlay'
import Portal from '@/components/ui/Portal'

function HeaderContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart()
  const { settings } = useSiteSettings()

  const checkSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setIsAdmin(session ? await isAdminClient() : false)
    } catch (err) {
      setIsLoggedIn(false)
      setIsAdmin(false)
    }
  }, [supabase])

  useEffect(() => {
    // Verificar se Supabase está configurado antes de tentar usar
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Supabase não configurado - não tenta fazer nada
      return
    }

    checkSession()
    
    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        checkSession()
      })

      return () => subscription.unsubscribe()
    } catch (err) {
      // Erro ao configurar listener - ignora
      console.error('Error setting up auth listener:', err)
    }
  }, [checkSession, supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out:', err)
    }
    setIsLoggedIn(false)
    setIsAdmin(false)
    router.push('/')
    router.refresh()
  }

  const isAdminPage = pathname?.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login' || pathname === '/login'
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL

  return (
    <header className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-dark/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Home */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Ir para a home do YUME">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              bg-cyber-glow/10 border border-cyber-glow/30
              text-cyber-glow group-hover:text-cyber-glowAlt group-hover:border-cyber-glowAlt/40
              transition-colors font-display font-black"
            title="夢 (Yume) = Sonho"
          >
            夢
          </span>
          <span className="font-display font-bold text-cyber-text group-hover:text-cyber-glow transition-colors tracking-wide">
            YUME
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Explore categories */}
          {!isAdminPage && !isLoginPage && (
            <button
              onClick={() => setIsCategoriesOpen(true)}
              className="px-4 py-2 rounded-lg bg-cyber-light/20 border border-cyber-border
                text-cyber-text hover:bg-cyber-light/30 transition-colors text-sm font-semibold
                flex items-center gap-2"
              aria-label="Abrir categorias"
            >
              <Grid3X3 className="w-4 h-4" />
              Categorias
            </button>
          )}

          {/* Search */}
          {!isAdminPage && !isLoginPage && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-3 py-2 rounded-lg bg-cyber-light/20 border border-cyber-border
                text-cyber-text hover:bg-cyber-light/30 transition-colors text-sm font-semibold
                flex items-center gap-2"
              aria-label="Buscar peças"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          )}

          {/* Social links */}
          {!isAdminPage && !isLoginPage && (
            <div className="hidden md:flex items-center gap-2">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cyber-light/20 border border-cyber-border text-cyber-text hover:bg-cyber-light/30 transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
                    'Salve! Vim pelo site do YUME e quero saber sobre as peças.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cyber-glow/15 border border-cyber-glow/30 text-cyber-glow hover:bg-cyber-glow/25 transition-colors"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Cart Button (only on store pages) */}
          {!isAdminPage && !isLoginPage && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-4 py-2 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
                text-cyber-glow hover:bg-cyber-glow/30 transition-colors text-sm font-semibold
                flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Carrinho
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full
                  bg-cyber-glowAlt text-cyber-dark text-xs font-bold
                  flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {isAdminPage && !isLoginPage && (
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-cyber-light/30 border border-cyber-border
                text-cyber-text hover:bg-cyber-light/50 transition-colors text-sm"
            >
              Ver Loja
            </Link>
          )}

          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
                    text-cyber-glow hover:bg-cyber-glow/30 transition-colors text-sm font-semibold
                    flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Painel
                </Link>
              ) : (
                <Link
                  href="/perfil"
                  className="px-4 py-2 rounded-lg bg-cyber-light/20 border border-cyber-border
                    text-cyber-text hover:bg-cyber-light/30 transition-colors text-sm font-semibold
                    flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Perfil
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-cyber-light/30 border border-cyber-border
                  text-cyber-text hover:bg-cyber-light/50 transition-colors text-sm
                  flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </>
          ) : !isLoginPage ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
                text-cyber-glow hover:bg-cyber-glow/30 transition-colors text-sm font-semibold
                flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          ) : null}
        </div>
      </div>

      {/* Global Cart Sidebar - accessible from header */}
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
  // Wrap in ErrorBoundary to catch context errors
  return (
    <ErrorBoundary
      fallback={
        <header className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-dark/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display font-bold text-cyber-text">YUME Atelier</span>
            </Link>
          </div>
        </header>
      }
    >
      <HeaderContent />
    </ErrorBoundary>
  )
}

