import { Category, Product } from '@/lib/types'

export const demoCategories: Category[] = [
  {
    id: 'demo-cat-camisas',
    name: 'Camisas',
    slug: 'camisas',
    description: 'Camisas box-cut feitas à mão. Cada uma com identidade própria.',
    background_image_url: '/images/products/camisa-gengar.jpg',
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-jorts',
    name: 'Jorts',
    slug: 'jorts',
    description: 'Bermudas jeans upcycled. Cada par construído a partir de peças descartadas.',
    background_image_url: '/images/products/jorts-flame.jpg',
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-calcas',
    name: 'Calças',
    slug: 'calcas',
    description: 'Calças baggy com recortes e patchwork artesanal.',
    background_image_url: '/images/products/calca-flame.jpg',
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-collab',
    name: 'YUME x B.R.A',
    slug: 'yume-x-bra',
    description: 'Colaboração entre YUME e B.R.A. Peças únicas de edição limitada.',
    background_image_url: '/images/products/camisa-gengar.jpg',
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function catBySlug(slug: string) {
  return demoCategories.find((c) => c.slug === slug) || null
}

export const demoProducts: Product[] = [
  {
    id: 'demo-prod-camisa-gengar',
    name: 'Camisa Box YUME x B.R.A — Ghost Type',
    slug: 'camisa-box-yume-x-bra-ghost-type',
    description:
      'Camisa box-cut em colaboração com a B.R.A. Inspirada no Ghost Type — Gengar. Tamanho PM.',
    artistic_description:
      'Uma collab que nasceu da mesma energia: dois projetos autorais que recusam o convencional. O Ghost Type não assombra — ele aparece.',
    technical_info:
      'Tamanho: PM • Material: denim upcycled • Confecção: 100% à mão • Peça única',
    category_id: 'demo-cat-collab',
    category: catBySlug('yume-x-bra') as any,
    status: 'available',
    price: 450,
    hero_video_url: undefined,
    image_urls: ['/images/products/camisa-gengar.jpg'],
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-camisa-flame',
    name: 'Camisa Box YUME — Blue Flames',
    slug: 'camisa-box-yume-blue-flames',
    description:
      'Camisa box-cut com estampa Blue Flames. Tamanho P.',
    artistic_description:
      'O fogo não queima — ele transforma. Peça feita pra quem prefere aparecer sem pedir permissão.',
    technical_info:
      'Tamanho: P • Material: denim upcycled • Confecção: 100% à mão • Peça única',
    category_id: 'demo-cat-camisas',
    category: catBySlug('camisas') as any,
    status: 'available',
    price: 250,
    hero_video_url: undefined,
    image_urls: ['/images/products/camisa-flame.jpg'],
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-jorts-flame',
    name: 'Jorts Azul Flames',
    slug: 'jorts-azul-flames',
    description:
      'Bermuda jeans azul com estampa flames. Tamanho 46.',
    artistic_description:
      '3 calças descartadas viraram isso. Zero desperdício, zero igual.',
    technical_info:
      'Tamanho: 46 • Material: denim upcycled • Confecção: 100% à mão • Peça única',
    category_id: 'demo-cat-jorts',
    category: catBySlug('jorts') as any,
    status: 'available',
    price: 350,
    hero_video_url: undefined,
    image_urls: ['/images/products/jorts-flame.jpg'],
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-calca-flame',
    name: 'Calça Baggy YUME Retalhos',
    slug: 'calca-baggy-yume-retalhos',
    description:
      'Calça baggy com patchwork de retalhos de jeans. Tamanho 48.',
    artistic_description:
      'Cada retalho tem uma história. Juntos, contam uma nova. Feita à mão, peça a peça.',
    technical_info:
      'Tamanho: 48 • Material: retalhos de denim upcycled • Confecção: 100% à mão • Peça única',
    category_id: 'demo-cat-calcas',
    category: catBySlug('calcas') as any,
    status: 'available',
    price: 250,
    hero_video_url: undefined,
    image_urls: ['/images/products/calca-flame.jpg'],
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-jorts-smile',
    name: 'Jorts Cinza Smile',
    slug: 'jorts-cinza-smile',
    description:
      'Bermuda jeans cinza com bordado smile. Tamanho 44.',
    artistic_description:
      'Simples na leitura rápida, complexo em cada costura. O smile é o detalhe que muda tudo.',
    technical_info:
      'Tamanho: 44 • Material: denim upcycled • Confecção: 100% à mão • Peça única',
    category_id: 'demo-cat-jorts',
    category: catBySlug('jorts') as any,
    status: 'available',
    price: 300,
    hero_video_url: undefined,
    image_urls: ['/images/products/jorts-smile.jpg'],
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-jorts-spider',
    name: 'Jorts Preto Spider',
    slug: 'jorts-preto-spider',
    description:
      'Bermuda jeans preta com estampa spider. Tamanho 44.',
    artistic_description:
      'Preto absoluto. A teia não aprisiona — ela conecta quem faz parte do mesmo universo.',
    technical_info:
      'Tamanho: 44 • Material: denim upcycled • Confecção: 100% à mão • Peça única',
    category_id: 'demo-cat-jorts',
    category: catBySlug('jorts') as any,
    status: 'available',
    price: 250,
    hero_video_url: undefined,
    image_urls: ['/images/products/jorts-spider.jpg'],
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-jorts-tiras',
    name: 'Jorts Azul Tiras',
    slug: 'jorts-azul-tiras',
    description:
      'Bermuda jeans azul com recortes em tiras. Tamanho 40.',
    artistic_description:
      'Desconstruído no corte, preciso na execução. Cada tira é intencional — nada aqui acontece por acidente.',
    technical_info:
      'Tamanho: 40 • Material: denim upcycled • Confecção: 100% à mão • Peça única',
    category_id: 'demo-cat-jorts',
    category: catBySlug('jorts') as any,
    status: 'available',
    price: 200,
    hero_video_url: undefined,
    image_urls: ['/images/products/jorts-tiras.jpg'],
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function getDemoCategory(slug: string) {
  return demoCategories.find((c) => c.slug === slug) || null
}

export function getDemoProductsByCategorySlug(slug: string) {
  const category = getDemoCategory(slug)
  if (!category) return []
  return demoProducts.filter((p) => p.category_id === category.id)
}

export function getDemoProductBySlug(slug: string) {
  return demoProducts.find((p) => p.slug === slug) || null
}
