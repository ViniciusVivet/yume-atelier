import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { User } from 'lucide-react'
import { withTimeout } from '@/lib/utils/withTimeout'
import { demoProducts, demoCategories } from '@/lib/demo/demoData'

const DASHBOARD_TIMEOUT = 5000

export default async function AdminDashboard() {
  let adminEmail = ''
  let productTotal = 0
  let categoryTotal = 0
  let availableCount = 0
  let soldOutCount = 0
  let madeToOrderCount = 0
  let usingDemoFallback = false

  try {
    const supabase = createServerClient()

    // Usuario logado
    const userResult = (await withTimeout(
      supabase.auth.getUser(),
      DASHBOARD_TIMEOUT,
      'admin dashboard getUser'
    )) as { data: { user: { email?: string | null } | null } }
    adminEmail = userResult.data.user?.email ?? ''

    // Contadores com timeout
    const [productsTotalRes, categoriesTotalRes, productsStatusRes] =
      (await Promise.all([
        withTimeout(
          supabase.from('products').select('*', { count: 'exact', head: true }),
          DASHBOARD_TIMEOUT,
          'admin dashboard total products'
        ),
        withTimeout(
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          DASHBOARD_TIMEOUT,
          'admin dashboard total categories'
        ),
        withTimeout(
          supabase.from('products').select('status'),
          DASHBOARD_TIMEOUT,
          'admin dashboard products status'
        ),
      ])) as [{ count: number | null }, { count: number | null }, { data: { status: string }[] | null }]

    productTotal = productsTotalRes.count ?? 0
    categoryTotal = categoriesTotalRes.count ?? 0

    const rows = productsStatusRes.data ?? []
    for (const row of rows) {
      if (row.status === 'available') availableCount += 1
      else if (row.status === 'sold_out') soldOutCount += 1
      else if (row.status === 'made_to_order') madeToOrderCount += 1
    }
  } catch (err) {
    console.error('Admin dashboard falling back to demo data:', err)
    usingDemoFallback = true

    // Fallback com dados demo em caso de erro/timeout
    productTotal = demoProducts.length
    categoryTotal = demoCategories.length
    for (const p of demoProducts) {
      if (p.status === 'available') availableCount += 1
      else if (p.status === 'sold_out') soldOutCount += 1
      else if (p.status === 'made_to_order') madeToOrderCount += 1
    }
  }

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="flex gap-10">
        {/* Menu lateral */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-cyber-textDim mb-2">
              Navegacao
            </p>
            <Link
              href="/admin"
              className="block px-4 py-2.5 rounded-lg bg-cyber-light/40 border border-cyber-glow/40 text-cyber-text font-medium hover:border-cyber-glow hover:bg-cyber-light/60 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/produtos"
              className="block px-4 py-2.5 rounded-lg bg-cyber-light/20 border border-cyber-border text-cyber-textDim hover:text-cyber-text hover:border-cyber-glow/40 hover:bg-cyber-light/40 transition-colors"
            >
              Produtos
            </Link>
            <Link
              href="/admin/categorias"
              className="block px-4 py-2.5 rounded-lg bg-cyber-light/20 border border-cyber-border text-cyber-textDim hover:text-cyber-text hover:border-cyber-glow/40 hover:bg-cyber-light/40 transition-colors"
            >
              Categorias
            </Link>
            <Link
              href="/admin/configuracoes"
              className="block px-4 py-2.5 rounded-lg bg-cyber-light/20 border border-cyber-border text-cyber-textDim hover:text-cyber-text hover:border-cyber-glow/40 hover:bg-cyber-light/40 transition-colors"
            >
              Configuracoes do site
            </Link>
            <Link
              href="/"
              className="mt-4 block px-4 py-2.5 rounded-lg bg-cyber-light/30 border border-cyber-border text-cyber-text hover:bg-cyber-light/50 transition-colors"
            >
              Ver loja publica
            </Link>
          </nav>
        </aside>

        {/* Conteudo principal */}
        <main className="flex-1">
          {/* Boas-vindas e perfil do admin */}
          <section className="mb-10 pb-8 border-b border-cyber-border space-y-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-cyber-text mb-1">
              Dashboard
            </h1>
            <p className="text-cyber-textDim">
              Visao rapida da sua loja, produtos e categorias.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-cyber-light/20 border border-cyber-border">
              <User className="w-5 h-5 text-cyber-glow" />
              <div>
                <p className="text-xs text-cyber-textDim uppercase tracking-wider">Conta admin</p>
                <p className="text-cyber-text font-medium">{adminEmail || 'Email nao detectado'}</p>
              </div>
            </div>
            {usingDemoFallback && (
              <div className="inline-flex items-start gap-3 px-4 py-3 rounded-2xl bg-cyber-light/30 border border-cyber-glow/40 shadow-[0_0_25px_rgba(0,255,255,0.25)] max-w-xl">
                <div className="mt-0.5 h-6 w-6 rounded-full bg-cyber-glow/20 border border-cyber-glow/60 flex items-center justify-center text-xs font-display text-cyber-glow">
                  !
                </div>
                <div className="text-left space-y-1 text-xs md:text-sm">
                  <p className="font-medium text-cyber-text">
                    Modo simulacao ativado
                  </p>
                  <p className="text-cyber-textDim">
                    Nao conseguimos falar com o banco agora (timeout ou erro no Supabase), entao este painel
                    esta mostrando **numeros de exemplo** com base nos dados demo. A experiencia visual e real,
                    so os numeros que estao em sandbox.
                  </p>
                </div>
              </div>
            )}
          </section>

          <h2 className="text-lg font-semibold text-cyber-textDim mb-4">Resumo da loja</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-cyber-textDim text-sm uppercase tracking-wider mb-2">
                Produtos
              </h3>
              <p className="text-3xl font-display font-bold text-cyber-glow">
                {productTotal}
              </p>
            </div>
            <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-cyber-textDim text-sm uppercase tracking-wider mb-2">
                Categorias
              </h3>
              <p className="text-3xl font-display font-bold text-cyber-glow">
                {categoryTotal}
              </p>
            </div>
            <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-cyber-textDim text-sm uppercase tracking-wider mb-2">
                Disponiveis
              </h3>
              <p className="text-3xl font-display font-bold text-emerald-400">
                {availableCount}
              </p>
            </div>
            <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-cyber-textDim text-sm uppercase tracking-wider mb-2">
                Esgotados / sob encomenda
              </h3>
              <p className="text-lg font-display font-semibold text-cyber-text">
                {soldOutCount} esgotados · {madeToOrderCount} sob encomenda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/produtos"
              className="block bg-cyber-light/30 border border-cyber-border rounded-lg p-8
                hover:bg-cyber-light/50 hover:border-cyber-glow/50 transition-all
                backdrop-blur-sm"
            >
              <h2 className="text-2xl font-display font-bold text-cyber-text mb-2">
                Gerenciar produtos
              </h2>
              <p className="text-cyber-textDim">
                Adicionar, editar e remover produtos.
              </p>
            </Link>

            <Link
              href="/admin/categorias"
              className="block bg-cyber-light/30 border border-cyber-border rounded-lg p-8
                hover:bg-cyber-light/50 hover:border-cyber-glow/50 transition-all
                backdrop-blur-sm"
            >
              <h2 className="text-2xl font-display font-bold text-cyber-text mb-2">
                Gerenciar categorias
              </h2>
              <p className="text-cyber-textDim">
                Organizar como os produtos aparecem para o cliente.
              </p>
            </Link>

            <Link
              href="/admin/configuracoes"
              className="block bg-cyber-light/30 border border-cyber-border rounded-lg p-8
                hover:bg-cyber-light/50 hover:border-cyber-glow/50 transition-all
                backdrop-blur-sm"
            >
              <h2 className="text-2xl font-display font-bold text-cyber-text mb-2">
                Configuracoes do site
              </h2>
              <p className="text-cyber-textDim">
                Ajustar WhatsApp, titulo, descricao e fundos do site.
              </p>
            </Link>

            <Link
              href="/admin/seed"
              className="block bg-cyber-glowAlt/10 border border-cyber-glowAlt/30 rounded-lg p-8
                hover:bg-cyber-glowAlt/20 hover:border-cyber-glowAlt/50 transition-all
                backdrop-blur-sm"
            >
              <h2 className="text-2xl font-display font-bold text-cyber-glowAlt mb-2">
                Criar produtos de teste
              </h2>
              <p className="text-cyber-textDim">
                Popular a loja rapidamente com exemplos para revisar o visual.
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

