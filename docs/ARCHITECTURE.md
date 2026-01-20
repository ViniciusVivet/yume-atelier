# 🏗️ Arquitetura do YUME Atelier

## Visão Geral

O YUME Atelier foi arquitetado para ser uma experiência digital premium, escalável e fácil de manter. A arquitetura segue princípios de:

- **Separação de responsabilidades**
- **Componentização reutilizável**
- **Type safety** (TypeScript em todo o projeto)
- **Server-side rendering** quando possível
- **Client-side interactivity** onde necessário

---

## Estrutura de Pastas

```
yume-atelier/
├── app/                          # Next.js App Router (páginas e rotas)
│   ├── layout.tsx               # Layout raiz (Server Component)
│   ├── page.tsx                 # Home page (Server Component)
│   ├── globals.css              # Estilos globais
│   ├── categoria/[slug]/        # Páginas dinâmicas de categoria
│   ├── produto/[slug]/          # Páginas dinâmicas de produto
│   ├── admin/                   # Painel administrativo
│   │   ├── layout.tsx           # Layout protegido (Server Component)
│   │   ├── page.tsx             # Dashboard (Server Component)
│   │   ├── login/               # Página de login (Client Component)
│   │   ├── produtos/            # CRUD de produtos (Client Components)
│   │   ├── categorias/          # CRUD de categorias (Client Components)
│   │   └── configuracoes/       # Configurações do site (Client Component)
│   └── api/                     # API Routes (Server Actions)
│       ├── products/            # Endpoints de produtos
│       ├── categories/          # Endpoints de categorias
│       ├── upload/              # Upload de arquivos
│       └── auth/                # Autenticação
│
├── components/                   # Componentes React reutilizáveis
│   ├── inventory/               # Componentes do inventário interativo
│   │   ├── InventoryCarousel.tsx    # Carrossel circular (CORE)
│   │   ├── ProductFocus.tsx         # Produto em destaque
│   │   └── ProductCard.tsx          # Card de produto
│   ├── navigation/
│   │   └── CategoryNavigator.tsx    # Navegação de categorias
│   └── ui/
│       └── WhatsAppCTA.tsx          # Botão de compra WhatsApp
│
├── lib/                          # Código compartilhado
│   ├── supabase/                # Configuração Supabase
│   │   ├── client.ts            # Cliente para browser
│   │   ├── server.ts            # Cliente para server
│   │   ├── database.types.ts     # Tipos TypeScript do banco
│   │   └── schema.sql           # Schema SQL do banco
│   ├── types/                    # Tipos TypeScript compartilhados
│   │   └── index.ts
│   └── utils/                    # Funções utilitárias
│       ├── cn.ts                # Class name utility (Tailwind)
│       └── whatsapp.ts         # Geração de links WhatsApp
│
└── public/                       # Arquivos estáticos
```

---

## Fluxo de Dados

### Cliente (Frontend Público)

```
1. Usuário acessa a página
   ↓
2. Server Component busca dados do Supabase
   ↓
3. Dados são passados para componentes
   ↓
4. Client Components renderizam interatividade
   ↓
5. Framer Motion anima transições
```

### Admin (Painel Administrativo)

```
1. Usuário faz login (/admin/login)
   ↓
2. Supabase Auth valida credenciais
   ↓
3. Server Component verifica sessão
   ↓
4. Client Components permitem CRUD
   ↓
5. API Routes processam requisições
   ↓
6. Supabase atualiza banco de dados
```

---

## Componentes Principais

### InventoryCarousel

**Responsabilidade:** Criar a experiência de inventário estilo jogo.

**Características:**
- Gerencia estado do produto em foco
- Calcula posições circulares dos produtos
- Anima transições entre produtos
- Gerencia background dinâmico

**Props:**
```typescript
{
  products: Product[]
  categoryBackground?: string
  onProductChange?: (product: Product) => void
}
```

### ProductFocus

**Responsabilidade:** Exibir produto em destaque com todas as informações.

**Características:**
- Hero image/video
- Status visual
- Descrições artísticas e técnicas
- CTA para WhatsApp

**Props:**
```typescript
{
  product: Product
  phoneNumber?: string
  messageTemplate?: string
}
```

### CategoryNavigator

**Responsabilidade:** Navegação horizontal de categorias.

**Características:**
- Scroll horizontal
- Indicador de categoria ativa
- Animações de hover

**Props:**
```typescript
{
  categories: Category[]
}
```

---

## Integração com Supabase

### Cliente (Browser)

```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

**Uso:** Client Components, hooks, interações do usuário.

### Servidor

```typescript
import { createServerClient } from '@/lib/supabase/server'
const supabase = createServerClient()
```

**Uso:** Server Components, API Routes, Server Actions.

---

## Segurança

### Autenticação

- **Supabase Auth** para login do admin
- **Row Level Security (RLS)** no banco de dados
- **Verificação de sessão** em todas as rotas admin

### Políticas RLS

```sql
-- Leitura pública para produtos e categorias
CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (true);

-- Escrita apenas para admins autenticados
-- (configurar baseado no email ou role)
```

---

## Performance

### Otimizações

1. **Server Components** — Renderização no servidor quando possível
2. **Next.js Image** — Otimização automática de imagens
3. **Lazy Loading** — Componentes carregados sob demanda
4. **Framer Motion** — Animações otimizadas com GPU

### Caching

- **Supabase queries** — Cache automático do Next.js
- **Static generation** — Páginas estáticas quando possível
- **ISR** — Incremental Static Regeneration para produtos

---

## Escalabilidade

### Preparado para:

1. **Checkout real** — Estrutura pronta para Stripe/Pix
2. **Mais produtos** — Paginação e filtros
3. **Mais categorias** — Sistema flexível
4. **Múltiplos admins** — Sistema de roles
5. **Analytics** — Integração fácil

### Limitações atuais (MVP):

- Upload de imagens via URL (não direto)
- Um admin apenas
- Sem paginação de produtos
- Sem busca/filtros avançados

---

## Decisões de Design

### Por que Next.js App Router?

- **Server Components** — Melhor performance
- **Roteamento moderno** — Mais intuitivo
- **API Routes integradas** — Tudo em um lugar

### Por que Supabase?

- **PostgreSQL** — Banco relacional robusto
- **Storage integrado** — Fácil gerenciamento de arquivos
- **Auth integrado** — Autenticação pronta
- **Row Level Security** — Segurança no banco

### Por que Framer Motion?

- **Animações cinematográficas** — Experiência premium
- **Performance** — Otimizado para GPU
- **API intuitiva** — Fácil de usar

### Por que Tailwind CSS?

- **Rápido desenvolvimento** — Utility-first
- **Customizável** — Tema cyberpunk personalizado
- **Performance** — CSS otimizado

---

## Próximos Passos

1. **Upload direto de imagens** — Integrar Supabase Storage UI
2. **Paginação** — Para muitos produtos
3. **Busca** — Filtros e pesquisa
4. **Checkout** — Integração Stripe/Pix
5. **Analytics** — Tracking de visualizações
6. **SEO** — Meta tags dinâmicas
7. **PWA** — App instalável

---

**Arquitetura pensada para crescer sem refatoração pesada.**

