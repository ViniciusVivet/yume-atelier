-- YUME Atelier - Dados de Teste
-- Execute este script no SQL Editor do Supabase após criar as tabelas

-- Primeiro, criar categorias de exemplo (se não existirem)
INSERT INTO categories (name, slug, description, display_order)
VALUES 
  ('Blusas', 'blusas', 'Blusas e camisetas', 1),
  ('Saias', 'saias', 'Saias femininas', 2),
  ('Acessórios', 'acessorios', 'Acessórios e complementos', 3)
ON CONFLICT (slug) DO NOTHING;

-- Criar produtos de teste
-- Produto 1: Blusa Jeans
INSERT INTO products (
  id,
  name,
  slug,
  description,
  artistic_description,
  technical_info,
  category_id,
  status,
  price,
  image_urls,
  display_order
)
SELECT
  gen_random_uuid(),
  'Blusa Jeans Destruída',
  'blusa-jeans-destruida',
  'Blusa jeans com cortes estratégicos e acabamento artesanal. Peça única com design disruptivo.',
  'Uma releitura da clássica blusa jeans, transformada em peça de arte através de cortes precisos e acabamento manual. Cada unidade é única, carregando a essência da moda disruptiva.',
  'Material: 100% Algodão Denim | Lavagem: Artesanal | Cuidados: Lavar à mão, não usar alvejante',
  (SELECT id FROM categories WHERE slug = 'blusas' LIMIT 1),
  'available',
  299.90,
  ARRAY[
    'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'
  ],
  1;

-- Produto 2: Saia Feminina
INSERT INTO products (
  id,
  name,
  slug,
  description,
  artistic_description,
  technical_info,
  category_id,
  status,
  price,
  image_urls,
  display_order
)
SELECT
  gen_random_uuid(),
  'Saia Asimétrica Preta',
  'saia-assimetrica-preta',
  'Saia feminina com corte assimétrico e tecido fluido. Design vanguardista para looks disruptivos.',
  'Uma peça que desafia a simetria tradicional. O corte assimétrico cria movimento e fluidez, enquanto o tecido preto oferece versatilidade para composições ousadas.',
  'Material: Poliéster Premium | Forro: 100% Algodão | Comprimento: Asimétrico (mín: 50cm, máx: 80cm)',
  (SELECT id FROM categories WHERE slug = 'saias' LIMIT 1),
  'available',
  349.90,
  ARRAY[
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'
  ],
  2;

-- Produto 3: Balaclava
INSERT INTO products (
  id,
  name,
  slug,
  description,
  artistic_description,
  technical_info,
  category_id,
  status,
  price,
  image_urls,
  display_order
)
SELECT
  gen_random_uuid(),
  'Balaclava Cyberpunk',
  'balaclava-cyberpunk',
  'Balaclava com design futurista e estampa exclusiva. Acessório essencial para looks disruptivos.',
  'Mais que um acessório, uma declaração. A balaclava cyberpunk combina funcionalidade com estética vanguardista, perfeita para quem busca destacar-se.',
  'Material: 95% Algodão, 5% Elastano | Estampa: Serigrafia | Tamanho: Único (ajustável)',
  (SELECT id FROM categories WHERE slug = 'acessorios' LIMIT 1),
  'available',
  89.90,
  ARRAY[
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'
  ],
  3;

-- Verificar se os produtos foram criados
SELECT 
  p.name,
  p.price,
  p.status,
  c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.display_order;

