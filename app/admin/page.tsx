import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = createServerClient()

  // Fetch stats
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-cyber-textDim text-sm uppercase tracking-wider mb-2">
            Produtos
          </h3>
          <p className="text-3xl font-display font-bold text-cyber-glow">
            {productCount || 0}
          </p>
        </div>
        <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-cyber-textDim text-sm uppercase tracking-wider mb-2">
            Categorias
          </h3>
          <p className="text-3xl font-display font-bold text-cyber-glow">
            {categoryCount || 0}
          </p>
        </div>
        <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-cyber-textDim text-sm uppercase tracking-wider mb-2">
            Status
          </h3>
          <p className="text-lg font-display font-semibold text-green-400">
            Online
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
            Gerenciar Produtos
          </h2>
          <p className="text-cyber-textDim">
            Adicionar, editar e remover produtos
          </p>
        </Link>

        <Link
          href="/admin/categorias"
          className="block bg-cyber-light/30 border border-cyber-border rounded-lg p-8
            hover:bg-cyber-light/50 hover:border-cyber-glow/50 transition-all
            backdrop-blur-sm"
        >
          <h2 className="text-2xl font-display font-bold text-cyber-text mb-2">
            Gerenciar Categorias
          </h2>
          <p className="text-cyber-textDim">
            Adicionar, editar e remover categorias
          </p>
        </Link>

        <Link
          href="/admin/configuracoes"
          className="block bg-cyber-light/30 border border-cyber-border rounded-lg p-8
            hover:bg-cyber-light/50 hover:border-cyber-glow/50 transition-all
            backdrop-blur-sm"
        >
          <h2 className="text-2xl font-display font-bold text-cyber-text mb-2">
            Configurações
          </h2>
          <p className="text-cyber-textDim">
            Configurar site, WhatsApp e imagens de fundo
          </p>
        </Link>

        <Link
          href="/admin/seed"
          className="block bg-cyber-glowAlt/10 border border-cyber-glowAlt/30 rounded-lg p-8
            hover:bg-cyber-glowAlt/20 hover:border-cyber-glowAlt/50 transition-all
            backdrop-blur-sm"
        >
          <h2 className="text-2xl font-display font-bold text-cyber-glowAlt mb-2">
            🧪 Criar Produtos de Teste
          </h2>
          <p className="text-cyber-textDim">
            Criar automaticamente 3 produtos de exemplo para testar a loja
          </p>
        </Link>
      </div>
    </div>
  )
}

