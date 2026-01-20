'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClient()

  const addStatus = (message: string) => {
    setStatus((prev) => [...prev, message])
  }

  const createTestProducts = async () => {
    setLoading(true)
    setStatus([])
    addStatus('🚀 Iniciando criação de produtos de teste...\n')

    try {
      // 1. Criar categorias
      addStatus('📁 Criando categorias...')
      const categories = [
        { name: 'Blusas', slug: 'blusas', description: 'Blusas e camisetas', display_order: 1 },
        { name: 'Saias', slug: 'saias', description: 'Saias femininas', display_order: 2 },
        { name: 'Acessórios', slug: 'acessorios', description: 'Acessórios e complementos', display_order: 3 },
      ]

      const categoryIds: Record<string, string> = {}
      
      for (const cat of categories) {
        const { data, error } = await supabase
          .from('categories')
          .upsert(cat, { onConflict: 'slug' })
          .select()
          .single()

        if (error && !error.message.includes('duplicate')) {
          addStatus(`❌ Erro ao criar categoria ${cat.name}: ${error.message}`)
        } else {
          categoryIds[cat.slug] = data?.id || ''
          addStatus(`✅ Categoria "${cat.name}" criada/encontrada`)
        }
      }

      // 2. Criar produtos
      addStatus('\n👕 Criando produtos...')

      const products = [
        {
          name: 'Blusa Jeans Destruída',
          slug: 'blusa-jeans-destruida',
          description: 'Blusa jeans com cortes estratégicos e acabamento artesanal. Peça única com design disruptivo.',
          artistic_description: 'Uma releitura da clássica blusa jeans, transformada em peça de arte através de cortes precisos e acabamento manual. Cada unidade é única, carregando a essência da moda disruptiva.',
          technical_info: 'Material: 100% Algodão Denim | Lavagem: Artesanal | Cuidados: Lavar à mão, não usar alvejante',
          category_id: categoryIds['blusas'],
          status: 'available',
          price: 299.90,
          image_urls: [
            'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
          ],
          display_order: 1
        },
        {
          name: 'Saia Asimétrica Preta',
          slug: 'saia-assimetrica-preta',
          description: 'Saia feminina com corte assimétrico e tecido fluido. Design vanguardista para looks disruptivos.',
          artistic_description: 'Uma peça que desafia a simetria tradicional. O corte assimétrico cria movimento e fluidez, enquanto o tecido preto oferece versatilidade para composições ousadas.',
          technical_info: 'Material: Poliéster Premium | Forro: 100% Algodão | Comprimento: Asimétrico (mín: 50cm, máx: 80cm)',
          category_id: categoryIds['saias'],
          status: 'available',
          price: 349.90,
          image_urls: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
            'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80'
          ],
          display_order: 2
        },
        {
          name: 'Balaclava Cyberpunk',
          slug: 'balaclava-cyberpunk',
          description: 'Balaclava com design futurista e estampa exclusiva. Acessório essencial para looks disruptivos.',
          artistic_description: 'Mais que um acessório, uma declaração. A balaclava cyberpunk combina funcionalidade com estética vanguardista, perfeita para quem busca destacar-se.',
          technical_info: 'Material: 95% Algodão, 5% Elastano | Estampa: Serigrafia | Tamanho: Único (ajustável)',
          category_id: categoryIds['acessorios'],
          status: 'available',
          price: 89.90,
          image_urls: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
            'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80'
          ],
          display_order: 3
        }
      ]

      for (const product of products) {
        const { data, error } = await supabase
          .from('products')
          .upsert(product, { onConflict: 'slug' })
          .select()
          .single()

        if (error) {
          addStatus(`❌ Erro ao criar produto "${product.name}": ${error.message}`)
        } else {
          addStatus(`✅ Produto "${product.name}" criado! (R$ ${product.price})`)
        }
      }

      addStatus('\n✨ Produtos de teste criados com sucesso!')
      addStatus('🌐 Recarregue a página inicial para ver os produtos')
      
      setTimeout(() => {
        router.push('/admin/produtos')
      }, 2000)
    } catch (error: any) {
      addStatus(`\n❌ Erro geral: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-8 py-12 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-cyber-textDim hover:text-cyber-glow transition-colors text-sm"
        >
          ← Voltar para Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-display font-bold text-cyber-text mb-8">
        Criar Produtos de Teste
      </h1>

      <div className="bg-cyber-light/30 border border-cyber-border rounded-lg p-6 mb-6 backdrop-blur-sm">
        <p className="text-cyber-textDim mb-4">
          Este script criará automaticamente:
        </p>
        <ul className="list-disc list-inside space-y-2 text-cyber-textDim">
          <li>3 categorias: Blusas, Saias, Acessórios</li>
          <li>Blusa Jeans Destruída (R$ 299,90)</li>
          <li>Saia Asimétrica Preta (R$ 349,90)</li>
          <li>Balaclava Cyberpunk (R$ 89,90)</li>
        </ul>
      </div>

      <button
        onClick={createTestProducts}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-cyber-glow/20 border border-cyber-glow/50
          text-cyber-glow font-display font-semibold
          hover:bg-cyber-glow/30 hover:shadow-glow transition-all
          disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {loading ? 'Criando produtos...' : 'Criar Produtos de Teste'}
      </button>

      {status.length > 0 && (
        <div className="bg-cyber-darker border border-cyber-border rounded-lg p-6">
          <h2 className="text-lg font-display font-semibold text-cyber-text mb-4">
            Log de Execução:
          </h2>
          <div className="space-y-1 font-mono text-sm">
            {status.map((msg, index) => (
              <div key={index} className="text-cyber-textDim whitespace-pre-wrap">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

