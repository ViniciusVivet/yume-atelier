/**
 * Script para criar produtos de teste
 * Execute: node scripts/create-test-products.js
 * 
 * Certifique-se de ter as variáveis de ambiente configuradas no .env.local
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestProducts() {
  console.log('🚀 Criando produtos de teste...\n')

  // 1. Criar categorias
  console.log('📁 Criando categorias...')
  const categories = [
    { name: 'Blusas', slug: 'blusas', description: 'Blusas e camisetas', display_order: 1 },
    { name: 'Saias', slug: 'saias', description: 'Saias femininas', display_order: 2 },
    { name: 'Acessórios', slug: 'acessorios', description: 'Acessórios e complementos', display_order: 3 },
  ]

  const categoryIds = {}
  for (const cat of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(cat, { onConflict: 'slug' })
      .select()
      .single()

    if (error && !error.message.includes('duplicate')) {
      console.error(`❌ Erro ao criar categoria ${cat.name}:`, error.message)
    } else {
      categoryIds[cat.slug] = data?.id
      console.log(`✅ Categoria "${cat.name}" criada/encontrada`)
    }
  }

  // 2. Criar produtos
  console.log('\n👕 Criando produtos...')

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
      console.error(`❌ Erro ao criar produto "${product.name}":`, error.message)
    } else {
      console.log(`✅ Produto "${product.name}" criado! (R$ ${product.price})`)
    }
  }

  console.log('\n✨ Produtos de teste criados com sucesso!')
  console.log('🌐 Acesse http://localhost:3002 para ver os produtos na loja')
}

createTestProducts().catch(console.error)

