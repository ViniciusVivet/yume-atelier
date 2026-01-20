import { Category, Product } from '@/lib/types'

export const demoCategories: Category[] = [
  {
    id: 'demo-cat-pecas-unicas',
    name: 'Peças Únicas',
    slug: 'pecas-unicas',
    description: 'Peças únicas feitas à mão no ateliê.',
    background_image_url: undefined,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-blusas',
    name: 'Blusas',
    slug: 'blusas',
    description: 'Blusas e camisetas com recortes e acabamento artesanal.',
    background_image_url: undefined,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-acessorios',
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Acessórios para completar o look disruptivo.',
    background_image_url: undefined,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function catBySlug(slug: string) {
  return demoCategories.find((c) => c.slug === slug) || null
}

export const demoProducts: Product[] = [
  {
    id: 'demo-prod-blusa-jeans',
    name: 'Blusa Jeans Destruída',
    slug: 'blusa-jeans-destruida',
    description:
      'Blusa jeans com cortes estratégicos e acabamento artesanal. Peça única com design disruptivo.',
    artistic_description:
      'Uma releitura da clássica blusa jeans, transformada em peça de arte através de cortes precisos e acabamento manual.',
    technical_info:
      'Material: Denim 100% algodão • Lavagem: artesanal • Cuidados: lavar à mão, secar à sombra',
    category_id: 'demo-cat-blusas',
    category: catBySlug('blusas') as any,
    status: 'available',
    price: 299.9,
    hero_video_url: undefined,
    image_urls: [
      'https://images.unsplash.com/photo-1520975869018-7f1d6f6a0c6a?w=1200&q=80',
      'https://images.unsplash.com/photo-1520975682071-a8b0c3f0f2d5?w=1200&q=80',
    ],
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-saia',
    name: 'Saia Asimétrica Preta',
    slug: 'saia-assimetrica-preta',
    description:
      'Saia com corte assimétrico e presença forte. Para looks de rua com assinatura autoral.',
    artistic_description:
      'A assimetria cria movimento e quebra o óbvio. Preto profundo, corte que conversa com tênis ou bota.',
    technical_info:
      'Material: tecido premium • Comprimento: assimétrico • Cuidados: lavagem delicada',
    category_id: 'demo-cat-pecas-unicas',
    category: catBySlug('pecas-unicas') as any,
    status: 'available',
    price: 349.9,
    hero_video_url: undefined,
    image_urls: [
      'https://images.unsplash.com/photo-1520975680389-2d5036c756c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1520975680406-8dca7a8a40a8?w=1200&q=80',
    ],
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-prod-balaclava',
    name: 'Balaclava Cyberpunk',
    slug: 'balaclava-cyberpunk',
    description:
      'Balaclava com estética futurista. Acessório essencial para composições disruptivas.',
    artistic_description:
      'Mais que um acessório: é identidade. Feita para palco, rua e noite.',
    technical_info: 'Material: algodão + elastano • Tamanho: único (ajustável)',
    category_id: 'demo-cat-acessorios',
    category: catBySlug('acessorios') as any,
    status: 'available',
    price: 89.9,
    hero_video_url: undefined,
    image_urls: [
      'https://images.unsplash.com/photo-1520975682071-a8b0c3f0f2d5?w=1200&q=80',
      'https://images.unsplash.com/photo-1520975869018-7f1d6f6a0c6a0c6a?w=1200&q=80',
    ],
    display_order: 3,
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


