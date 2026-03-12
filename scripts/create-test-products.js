/**
 * Script de seed do catálogo real YUME
 * Apaga tudo do Supabase e recria com os dados reais do spyume.com
 *
 * Execute: node scripts/create-test-products.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

// Usa service role para bypass de RLS nos deletes; cai para anon se não tiver
const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey)

// ─────────────────────────────────────────────
// CATEGORIAS REAIS
// ─────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Camisas',
    slug: 'camisas',
    description: 'Camisas box-cut feitas à mão. Cada uma com identidade própria.',
    background_image_url: '/images/products/camisa-gengar.jpg',
    display_order: 1,
  },
  {
    name: 'Jorts',
    slug: 'jorts',
    description: 'Bermudas jeans upcycled. Cada par construído a partir de peças descartadas.',
    background_image_url: '/images/products/jorts-flame.jpg',
    display_order: 2,
  },
  {
    name: 'Calças',
    slug: 'calcas',
    description: 'Calças baggy com recortes e patchwork artesanal.',
    background_image_url: '/images/products/calca-flame.jpg',
    display_order: 3,
  },
  {
    name: 'YUME x B.R.A',
    slug: 'yume-x-bra',
    description: 'Colaboração entre YUME e B.R.A. Peças únicas de edição limitada.',
    background_image_url: '/images/products/camisa-gengar.jpg',
    display_order: 4,
  },
]

// ─────────────────────────────────────────────
// PRODUTOS REAIS (catálogo spyume.com)
// ─────────────────────────────────────────────
function buildProducts(categoryIds) {
  return [
    {
      name: 'Camisa Box YUME x B.R.A — Ghost Type',
      slug: 'camisa-box-yume-x-bra-ghost-type',
      description: 'Camisa box-cut em colaboração com a B.R.A. Inspirada no Ghost Type — Gengar. Tamanho PM.',
      artistic_description:
        'Uma collab que nasceu da mesma energia: dois projetos autorais que recusam o convencional. O Ghost Type não assombra — ele aparece.',
      technical_info: 'Tamanho: PM · Material: denim upcycled · Confecção: 100% à mão · Peça única',
      category_id: categoryIds['yume-x-bra'],
      status: 'available',
      price: 450,
      image_urls: ['/images/products/camisa-gengar.jpg'],
      display_order: 1,
    },
    {
      name: 'Camisa Box YUME — Blue Flames',
      slug: 'camisa-box-yume-blue-flames',
      description: 'Camisa box-cut com estampa Blue Flames. Tamanho P.',
      artistic_description:
        'O fogo não queima — ele transforma. Peça feita pra quem prefere aparecer sem pedir permissão.',
      technical_info: 'Tamanho: P · Material: denim upcycled · Confecção: 100% à mão · Peça única',
      category_id: categoryIds['camisas'],
      status: 'available',
      price: 250,
      image_urls: ['/images/products/camisa-flame.jpg'],
      display_order: 2,
    },
    {
      name: 'Jorts Azul Flames',
      slug: 'jorts-azul-flames',
      description: 'Bermuda jeans azul com estampa flames. Tamanho 46.',
      artistic_description: '3 calças descartadas viraram isso. Zero desperdício, zero igual.',
      technical_info: 'Tamanho: 46 · Material: denim upcycled · Confecção: 100% à mão · Peça única',
      category_id: categoryIds['jorts'],
      status: 'available',
      price: 350,
      image_urls: ['/images/products/jorts-flame.jpg'],
      display_order: 3,
    },
    {
      name: 'Calça Baggy YUME Retalhos',
      slug: 'calca-baggy-yume-retalhos',
      description: 'Calça baggy com patchwork de retalhos de jeans. Tamanho 48.',
      artistic_description:
        'Cada retalho tem uma história. Juntos, contam uma nova. Feita à mão, peça a peça.',
      technical_info: 'Tamanho: 48 · Material: retalhos de denim upcycled · Confecção: 100% à mão · Peça única',
      category_id: categoryIds['calcas'],
      status: 'available',
      price: 250,
      image_urls: ['/images/products/calca-flame.jpg'],
      display_order: 4,
    },
    {
      name: 'Jorts Cinza Smile',
      slug: 'jorts-cinza-smile',
      description: 'Bermuda jeans cinza com bordado smile. Tamanho 44.',
      artistic_description:
        'Simples na leitura rápida, complexo em cada costura. O smile é o detalhe que muda tudo.',
      technical_info: 'Tamanho: 44 · Material: denim upcycled · Confecção: 100% à mão · Peça única',
      category_id: categoryIds['jorts'],
      status: 'available',
      price: 300,
      image_urls: ['/images/products/jorts-smile.jpg'],
      display_order: 5,
    },
    {
      name: 'Jorts Preto Spider',
      slug: 'jorts-preto-spider',
      description: 'Bermuda jeans preta com estampa spider. Tamanho 44.',
      artistic_description:
        'Preto absoluto. A teia não aprisiona — ela conecta quem faz parte do mesmo universo.',
      technical_info: 'Tamanho: 44 · Material: denim upcycled · Confecção: 100% à mão · Peça única',
      category_id: categoryIds['jorts'],
      status: 'available',
      price: 250,
      image_urls: ['/images/products/jorts-spider.jpg'],
      display_order: 6,
    },
    {
      name: 'Jorts Azul Tiras',
      slug: 'jorts-azul-tiras',
      description: 'Bermuda jeans azul com recortes em tiras. Tamanho 40.',
      artistic_description:
        'Desconstruído no corte, preciso na execução. Cada tira é intencional — nada aqui acontece por acidente.',
      technical_info: 'Tamanho: 40 · Material: denim upcycled · Confecção: 100% à mão · Peça única',
      category_id: categoryIds['jorts'],
      status: 'available',
      price: 200,
      image_urls: ['/images/products/jorts-tiras.jpg'],
      display_order: 7,
    },
  ]
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function seed() {
  console.log('🔥 Iniciando seed do catálogo YUME...\n')

  // 1. Deletar produtos existentes
  console.log('🗑️  Deletando produtos antigos...')
  const { error: delProductsErr } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // deleta tudo

  if (delProductsErr) {
    console.error('❌ Erro ao deletar produtos:', delProductsErr.message)
    console.log('⚠️  Continuando mesmo assim...')
  } else {
    console.log('✅ Produtos antigos deletados')
  }

  // 2. Deletar categorias existentes
  console.log('🗑️  Deletando categorias antigas...')
  const { error: delCatsErr } = await supabase
    .from('categories')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // deleta tudo

  if (delCatsErr) {
    console.error('❌ Erro ao deletar categorias:', delCatsErr.message)
    console.log('⚠️  Continuando mesmo assim...')
  } else {
    console.log('✅ Categorias antigas deletadas\n')
  }

  // 3. Inserir categorias reais
  console.log('📁 Inserindo categorias reais...')
  const categoryIds = {}

  for (const cat of CATEGORIES) {
    const { data, error } = await supabase
      .from('categories')
      .insert(cat)
      .select('id, slug')
      .single()

    if (error) {
      console.error(`❌ Erro na categoria "${cat.name}":`, error.message)
      process.exit(1)
    }

    categoryIds[cat.slug] = data.id
    console.log(`   ✅ ${cat.name} (${data.id})`)
  }

  // 4. Inserir produtos reais
  console.log('\n👕 Inserindo produtos reais...')
  const products = buildProducts(categoryIds)

  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select('id, name')
      .single()

    if (error) {
      console.error(`❌ Erro no produto "${product.name}":`, error.message)
      process.exit(1)
    }

    console.log(`   ✅ ${product.name} — R$ ${product.price}`)
  }

  // 5. Atualizar site_settings com o WhatsApp correto
  console.log('\n⚙️  Atualizando configurações do site...')
  const { data: existingSettings } = await supabase
    .from('site_settings')
    .select('id')
    .single()

  const settingsPayload = {
    site_title: 'YUME Atelier',
    site_description: 'Moda upcycled feita à mão em São Paulo. Zero desperdício, zero igual.',
    whatsapp_number: '5511986765219',
    whatsapp_message_template: 'Salve! Tenho interesse na peça {PRODUCT_NAME} do YUME. Como faço pra comprar?',
  }

  if (existingSettings?.id) {
    const { error } = await supabase
      .from('site_settings')
      .update(settingsPayload)
      .eq('id', existingSettings.id)
    if (error) console.error('⚠️  Erro ao atualizar settings:', error.message)
    else console.log('   ✅ site_settings atualizado')
  } else {
    const { error } = await supabase.from('site_settings').insert(settingsPayload)
    if (error) console.error('⚠️  Erro ao criar settings:', error.message)
    else console.log('   ✅ site_settings criado')
  }

  console.log('\n🎉 Catálogo YUME real carregado com sucesso!')
  console.log(`   ${products.length} produtos · ${CATEGORIES.length} categorias`)
  console.log('\n🌐 Acesse http://localhost:3002 para ver o resultado')
}

seed().catch((err) => {
  console.error('💥 Erro fatal:', err)
  process.exit(1)
})
