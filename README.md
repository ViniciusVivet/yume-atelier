# 🔮 YUME Atelier

**Ateliê independente de moda disruptiva** — catálogo premium (não checkout) com estética cyberpunk e UX inspirada em games.

---

## 📋 Visão Geral (humano)

YUME Atelier é um catálogo interativo de moda experimental que transforma a navegação de produtos em uma experiência imersiva. O projeto combina:

- **Catálogo estilo “loja” + interação** — grid moderno, filtros rápidos e páginas de produto imersivas
- **Estética cyberpunk/dark** — blur, glow, grain, contraste
- **Admin no próprio site** — CRUD de produtos/categorias/config, sem mexer no Supabase UI no dia a dia
- **Compra via WhatsApp** — CTA com mensagem pronta (MVP)
- **Modo demonstração** — se não houver dados no Supabase, o site mostra produtos demo para você validar o visual

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animações cinematográficas)

### Backend / CMS
- **Supabase**
  - PostgreSQL (banco de dados)
  - Storage (imagens e vídeos)
  - Auth (autenticação para admin)

### Deploy
- **Vercel** (frontend)
- **Supabase** (backend + storage)

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js 18+**
- **npm** (ou outro gerenciador compatível)

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd yume-atelier
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o schema SQL em `lib/supabase/schema.sql` no SQL Editor do Supabase
3. Configure o Storage:
   - Crie um bucket chamado `yume-atelier`
   - Configure políticas de acesso (público para leitura, autenticado para escrita)
   - Rode `lib/supabase/mvp_policies.sql` para RLS + policies (MVP)

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (use `docs/env.example` como base):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Opcional: Instagram URL
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/seu_perfil

# (Opcional) Credenciais iniciais do admin
ADMIN_EMAIL=admin@yumeatelier.com
ADMIN_PASSWORD=sua_senha_segura

# (Opcional) WhatsApp padrão
WHATSAPP_NUMBER=5511999999999
WHATSAPP_MESSAGE_TEMPLATE=Salve! Tenho interesse na peça {PRODUCT_NAME} do YUME Atelier.
```

**Nota:** O número do WhatsApp é configurado no admin (`/admin/configuracoes`) ou via SQL (veja `docs/UPDATE_WHATSAPP.sql`).

### 5. Execute o projeto

```bash
npm run dev
```

Por padrão o projeto roda em: **`http://localhost:3002`**

---

## 🧰 Scripts Disponíveis

```bash
npm run dev     # ambiente de desenvolvimento
npm run build   # build de produção
npm run start   # iniciar build
npm run lint    # lint
npm run seed    # seed de produtos de teste
```

---

## 📁 Estrutura do Projeto

```
yume-atelier/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Home (catálogo geral)
│   ├── globals.css              # Estilos globais
│   ├── categoria/[slug]/        # Página de categoria
│   ├── produto/[slug]/          # Página de produto
│   ├── admin/                   # Painel administrativo
│   │   ├── layout.tsx           # Layout protegido
│   │   ├── page.tsx             # Dashboard
│   │   ├── login/               # Login
│   │   ├── produtos/            # CRUD de produtos
│   │   ├── categorias/          # CRUD de categorias
│   │   ├── configuracoes/       # Configurações do site
│   │   └── seed/                # Seed de produtos de teste
│   ├── api/                     # API Routes
│   │   ├── products/            # CRUD produtos
│   │   ├── categories/          # CRUD categorias
│   │   ├── upload/              # Upload de arquivos
│   │   └── auth/                # Autenticação
│   └── login/                   # Login geral
├── components/
│   ├── admin/                   # Componentes admin
│   │   └── ImageUpload.tsx      # Upload de imagens
│   ├── inventory/               # Componentes do inventário
│   │   ├── InventoryCarousel.tsx    # Carrossel circular
│   │   ├── ProductFocus.tsx         # Produto em destaque
│   │   └── ProductCard.tsx          # Card de produto (3D)
│   ├── landing/                 # Landing pages
│   │   ├── DemoBanner.tsx       # Banner modo demo
│   │   └── HeroLanding.tsx      # Landing page inicial
│   ├── layout/                  # Layout components
│   │   ├── AppShell.tsx         # Shell principal
│   │   └── Header.tsx           # Header global
│   ├── navigation/              # Navegação
│   │   ├── CategoriesDrawer.tsx    # Drawer de categorias
│   │   └── CategoryNavigator.tsx    # Navegação horizontal
│   ├── search/                  # Busca
│   │   └── SearchOverlay.tsx    # Overlay de busca
│   ├── store/                   # Loja
│   │   ├── CartSidebar.tsx      # Sidebar do carrinho
│   │   ├── ProductGrid.tsx      # Grid de produtos
│   │   ├── ProductModal.tsx     # Modal de produto
│   │   ├── StoreHero.tsx        # Hero da loja
│   │   └── StoreLayout.tsx      # Layout da loja
│   └── ui/                      # UI components
│       ├── CursorGlow.tsx       # Cursor customizado
│       ├── PageTransition.tsx    # Transições de página
│       ├── Portal.tsx            # Portal para modais
│       ├── Skeleton.tsx          # Skeleton loading
│       └── WhatsAppCTA.tsx       # Botão WhatsApp
├── contexts/                    # React Contexts
│   ├── CartContext.tsx          # Context do carrinho
│   ├── CategoriesContext.tsx   # Context de categorias
│   └── SiteSettingsContext.tsx  # Context de configurações
├── docs/                        # Documentação
│   ├── ANALISE_PROJETO.md       # Análise completa
│   ├── ARCHITECTURE.md          # Arquitetura detalhada
│   ├── PROJECT_SUMMARY.md       # Resumo do projeto
│   ├── SETUP.md                 # Guia de setup
│   ├── VERIFICAR_CONFIG.md      # Troubleshooting
│   └── *.sql                    # Scripts SQL
├── lib/
│   ├── demo/                    # Dados demo
│   │   └── demoData.ts         # Produtos/categorias demo
│   ├── supabase/               # Configuração Supabase
│   │   ├── client.ts           # Cliente (browser)
│   │   ├── server.ts           # Cliente (server)
│   │   ├── database.types.ts    # Tipos TypeScript
│   │   ├── schema.sql          # Schema do banco
│   │   ├── mvp_policies.sql    # Políticas RLS
│   │   └── seed-data.sql       # Dados de teste
│   ├── types/                  # Tipos TypeScript
│   │   └── index.ts
│   └── utils/                  # Utilitários
│       ├── cn.ts               # Class name utility
│       ├── whatsapp.ts         # Geração de links WhatsApp
│       └── withTimeout.ts      # Timeout para promises
├── scripts/                     # Scripts
│   └── create-test-products.js  # Script de seed
├── middleware.ts                # Next.js middleware
└── public/                      # Arquivos estáticos
```

---

## 🎨 Componentes Principais

### ProductCard (3D Interactive)

Card de produto com efeitos avançados:

- **Hover 3D** — Tilt baseado na posição do mouse
- **Parallax** — Efeito de profundidade
- **Blur Animado** — Blur que respira no hover
- **Glow Pulsante** — Efeito de brilho animado
- **Skeleton Loading** — Loading state para imagens

### ProductModal

Modal fullscreen para produtos:

- **Fullscreen** — Experiência imersiva
- **Animações Suaves** — Entrada/saída com spring
- **Portal** — Renderizado fora da hierarquia DOM
- **Backdrop Blur** — Efeito de profundidade

### ProductGrid

Grid responsivo com animações:

- **Stagger Animation** — Cards aparecem em sequência
- **Responsivo** — 1-4 colunas conforme tamanho da tela
- **Filtros** — Filtro por categoria, status, busca

### CartSidebar

Sidebar do carrinho:

- **Drawer Lateral** — Desliza da direita
- **Persistência** — Salva em localStorage
- **WhatsApp Checkout** — Mensagem com todos os itens
- **Animações** — Transições suaves

### CategoriesDrawer

Drawer de categorias:

- **Sidebar Lateral** — Desliza da esquerda
- **Navegação Visual** — Cards com imagens
- **Estado Ativo** — Indica categoria atual

### SearchOverlay

Overlay de busca fullscreen:

- **Busca por Texto** — Nome, descrição, etc.
- **Filtros** — Por status (disponível, sold out, etc.)
- **Animações** — Entrada/saída suave

### PageTransition

Transições entre páginas:

- **Fade/Slide** — Transição suave
- **Easing Customizado** — Curva de animação premium
- **Prefetch** — Prefetch automático de rotas

### CursorGlow

Cursor customizado cyberpunk:

- **Glow Effect** — Brilho que segue o mouse
- **Spotlight** — Efeito de luz maior
- **Mix Blend Mode** — Efeito de tela

---

## 🗄️ Modelo de Dados

### Products

```typescript
{
  id: string
  name: string
  slug: string
  description: string
  artistic_description?: string
  technical_info?: string
  category_id: string
  status: 'available' | 'sold_out' | 'made_to_order'
  price?: number
  hero_video_url?: string
  image_urls: string[]
  display_order: number
  created_at: string
  updated_at: string
}
```

### Categories

```typescript
{
  id: string
  name: string
  slug: string
  description?: string
  background_image_url?: string
  display_order: number
  created_at: string
  updated_at: string
}
```

### SiteSettings

```typescript
{
  id: string
  global_background_image_url?: string
  global_background_video_url?: string
  site_title: string
  site_description: string
  whatsapp_number: string
  whatsapp_message_template: string
  created_at: string
  updated_at: string
}
```

---

## 🔐 Painel Administrativo

Acesse `/admin` para gerenciar o conteúdo.

### Funcionalidades

- ✅ **Login protegido** — Autenticação via Supabase Auth
- ✅ **CRUD de produtos** — Criar, editar, excluir produtos
- ✅ **CRUD de categorias** — Gerenciar categorias
- ✅ **Upload de imagens** — Via Supabase Storage
- ✅ **Configurações do site** — WhatsApp, imagens de fundo, etc.

### Primeiro Acesso

1. Crie um usuário no Supabase Auth (via dashboard ou API)
2. Faça login em `/admin/login`
3. Configure as categorias primeiro
4. Adicione produtos

---

## 🎯 Fluxo do Usuário

### Cliente

1. **Home** → Visualiza produtos (ou catálogo demo se ainda não houver dados)
2. **Categorias** → Drawer de categorias no header
3. **Buscar** → Overlay (lupa) para filtrar por texto + status
4. **Produto** → Página com galeria + zoom + CTA WhatsApp
5. **Carrinho** → Opcional (local) e “finalizar via WhatsApp”

### Criador (Admin)

1. **Login** → `/login` (e depois `/admin`)
2. **Dashboard** → Visão geral e acesso rápido
3. **Produtos** → Adiciona/edita produtos
4. **Categorias** → Gerencia categorias
5. **Configurações** → Ajusta WhatsApp, imagens de fundo, etc.
6. **Seed** → `/admin/seed` cria produtos de teste com 1 clique

---

## 🎨 Estilo Visual

### Cores (Tailwind Config)

```typescript
cyber: {
  dark: '#0a0a0a',        // Fundo principal
  darker: '#050505',     // Fundo secundário
  light: '#1a1a1a',      // Cards/containers
  border: '#2a2a2a',     // Bordas
  glow: '#00ffff',       // Cyan glow (principal)
  glowAlt: '#ff00ff',    // Magenta glow (alternativo)
  text: '#e0e0e0',       // Texto principal
  textDim: '#888888',    // Texto secundário
}
```

### Efeitos

- **Blur** — Backdrop blur para profundidade
- **Grain** — Textura sutil de filme
- **Glow** — Brilho cyberpunk em elementos interativos
- **Glitch** — Efeito glitch em status "sold out"

---

## 🚀 Deploy

### Vercel

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Supabase

- O banco e storage já estão no Supabase
- Configure CORS se necessário
- Ajuste políticas RLS conforme necessário

---

## 🔮 Próximos Passos (Escalabilidade)

### Implementado Recentemente

- ✅ **Transições entre páginas** — Fade/slide suave
- ✅ **Cards 3D** — Hover com tilt e parallax
- ✅ **Modal fullscreen** — Experiência imersiva
- ✅ **Cursor customizado** — Glow e spotlight
- ✅ **Background dinâmico** — Muda por categoria
- ✅ **Skeleton loading** — Loading states

### Próximas Implementações Sugeridas

Veja a análise completa em [`docs/ANALISE_PROJETO.md`](docs/ANALISE_PROJETO.md)

**Prioridade Alta:**
- Paginação de produtos
- Filtros avançados (preço, ordenação)
- Upload direto de imagens melhorado
- SEO básico (meta tags dinâmicas)

**Prioridade Média:**
- Sistema de favoritos
- Analytics básico
- Variações de produto (tamanhos, cores)
- Checkout real (Stripe/Pix)

**Prioridade Baixa:**
- PWA completo
- Sistema de usuários
- Avaliações e comentários
- Newsletter

---

## 📝 Notas Importantes

### Configuração do WhatsApp

O número do WhatsApp pode ser configurado de duas formas:

1. **Via Admin** (`/admin/configuracoes`) — Interface visual
2. **Via SQL** — Execute `docs/UPDATE_WHATSAPP.sql` no Supabase

**Número padrão:** `5511986765219` (11 98676-5219)

### Supabase Storage

- Bucket deve se chamar `yume-atelier`
- Configure políticas de acesso adequadas (veja `lib/supabase/mvp_policies.sql`)
- URLs públicas são geradas automaticamente

### Autenticação

- Admin usa Supabase Auth
- Configure políticas RLS no banco (veja `lib/supabase/mvp_policies.sql`)
- Middleware sincroniza sessão entre client e server

### Performance

- Imagens via Next.js Image component
- Skeleton loading para melhor UX
- Timeout em requisições Supabase (3s)
- Demo data fallback quando Supabase não configurado

### Documentação

Toda a documentação está na pasta `docs/`:

- `ANALISE_PROJETO.md` — Análise completa de funcionalidades
- `ARCHITECTURE.md` — Arquitetura detalhada
- `SETUP.md` — Guia passo a passo de setup
- `VERIFICAR_CONFIG.md` — Troubleshooting comum

---

## 🐛 Troubleshooting

### Erro de conexão Supabase

- Verifique variáveis de ambiente
- Confirme que o projeto Supabase está ativo
- Teste conexão no dashboard

### Imagens não carregam

- Verifique configuração do bucket
- Confirme políticas de acesso
- URLs devem ser públicas ou autenticadas

### Admin não funciona

- Verifique autenticação no Supabase
- Confirme que o usuário existe
- Reinicie `npm run dev` após mudanças no `.env.local`
- `middleware.ts` é necessário para o SSR enxergar a sessão

---

## 📄 Licença

Este é um projeto autoral. Todos os direitos reservados.

---

## 👤 Autor

**YUME Atelier** — Moda Experimental

---

**Feito com 🔮 para experiências digitais únicas.**

