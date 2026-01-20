import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Only redirect if not on login page (login page doesn't use this layout)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {session && (
        <div className="border-b border-cyber-border bg-cyber-light/30 backdrop-blur-xl">
          <div className="container mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-2xl font-display font-bold text-cyber-glow hover:text-cyber-glowAlt transition-colors">
                  YUME Atelier Admin
                </Link>
                <Link
                  href="/"
                  className="px-3 py-1.5 rounded-lg bg-cyber-light/30 border border-cyber-border
                    text-cyber-text hover:bg-cyber-light/50 transition-colors text-sm"
                >
                  Ver Loja
                </Link>
              </div>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyber-light/50 border border-cyber-border
                    text-cyber-text hover:bg-cyber-light/70 transition-colors"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

