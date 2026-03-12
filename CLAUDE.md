# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server on port 3002
npm run build     # Production build
npm run lint      # ESLint
npm run seed      # Seed test products via scripts/create-test-products.js
```

No test suite is configured. Validate changes with `npm run build` and `npm run lint`.

## Brand & Project Context" 
logo após o primeiro parágrafo do arquivo, com o seguinte: Este site é para a marca YUME (@sp.yume no Instagram, 1.296 seguidores), do Camaleão, amigo do desenvolvedor Vivet. A YUME faz upcycling de jeans à mão em São Paulo. O site atual do cliente é spyume.com (Shopify genérico) — nosso objetivo é fazer um site tão superior que ele prefira usar o nosso. Visual obrigatório: cyberpunk, dark, neon cyan/magenta, kanji 夢, glitch, scanlines, grain. Footer com "SITE BY ORBITAMOS". WhatsApp: 5511986765219. Prioridade 1: arrumar imagens quebradas na home e deixar visual insano. Mobile-first pois o tráfego vem do Instagram. Problemas conhecidos: tabela admin_users pode não existir no Supabase (causa "Database error querying schema"), email confirmation loop no Supabase Auth, imagens quebradas na seção "Destaques YUME

## Architecture

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + Storage) · Framer Motion

### Directory Structure

```
app/                  # Next.js App Router pages
  api/                # API routes (products, categories, upload, auth/signout)
  admin/              # Protected admin panel (productos, categorias, configuracoes)
  categoria/[slug]/   # Public category pages
  produto/[slug]/     # Public product detail pages
  login/              # Standalone login (separate from /admin/login)
components/
  inventory/          # InventoryCarousel, ProductFocus, ProductCard (core UX)
  layout/             # AppShell, Header
  navigation/         # CategoryNavigator, CategoriesDrawer
  store/              # StoreLayout, ProductGrid, ProductModal, CartSidebar
  admin/              # AdminAuthGuard, ImageUpload, VideoUpload
  ui/                 # Toast, Skeleton, Portal, etc.
contexts/             # CartContext, SiteSettingsContext, CategoriesContext, ToastContext
lib/
  supabase/           # client.ts (browser), server.ts (SSR), database.types.ts, schema.sql
  types/index.ts      # Core types: Product, Category, SiteSettings, InventoryViewProduct
  utils/              # cn.ts (Tailwind), whatsapp.ts, withTimeout.ts
  demo/demoData.ts    # Fallback demo data when Supabase is unconfigured
```

### Key Architectural Patterns

**Supabase clients — never mix them:**
- `@/lib/supabase/client` → browser/Client Components
- `@/lib/supabase/server` → Server Components, API routes (uses `cookies()` from `next/headers`)

Both clients have a graceful mock fallback when env vars are missing, so the app renders with demo data without Supabase configured.

**Admin auth:** Protected via `AdminAuthGuard` (Client Component) rather than Server Component middleware. This avoids session cookie timing issues on first request after login. The pattern comment is in `app/admin/layout.tsx`.

**API routes use service role:** Product/category mutations use the Supabase service role key (via `SUPABASE_SERVICE_ROLE_KEY`) to bypass RLS for write operations. Read operations use anon key with public RLS.

**Demo/fallback pattern:** `app/layout.tsx` fetches categories with a 2-second timeout (`withTimeout`), then falls back to `demoCategories` if the fetch fails or returns empty.

**WhatsApp as checkout:** There is no payment integration. The CTA sends users to WhatsApp via a pre-filled link. The number and message template are stored in `site_settings` table and provided via `SiteSettingsContext`.

### Supabase Schema

Three tables: `products`, `categories`, `site_settings`. Key fields:
- `products.status`: `'available' | 'sold_out' | 'made_to_order'`
- `products.image_urls`: `text[]` (array of URLs)
- `categories.background_image_url`: used as page background in the inventory view
- `site_settings`: single-row config for WhatsApp number, message template, global background

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # Required for admin write operations
```

### Styling

Tailwind with a cyberpunk/dark theme defined in `tailwind.config.ts`. Custom colors:
- `cyber-dark` (#0a0a0a), `cyber-glow` (#00ffff), `cyber-glowAlt` (#ff00ff)
- Custom animations: `glow-pulse`, `glitch`, `float`

Use `cn()` from `@/lib/utils/cn` (wraps `clsx` + `tailwind-merge`) for conditional class names.

---

## Brand Values & Environmental Impact (USE THIS IN UX/COPY)

YUME is not just fashion — it's a statement against the destruction caused by fast fashion. The founder (Camaleão) is deeply concerned about environmental impact. This MUST come through in the site's messaging, about page, and product storytelling.

### The Problem YUME Fights

- The fashion industry produces 92 million tonnes of textile waste per year globally
- It's responsible for 10% of global carbon emissions — more than aviation and shipping combined
- A single cotton t-shirt requires 2,700 liters of water to produce
- Only 12% of clothing materials are recycled — the rest goes to landfills
- Clothes production doubled from 2000 to 2015, but garment usage time dropped 36%
- Discarded clothing is dumped in low-income countries causing severe environmental damage
- Textile dyeing is the second largest polluter of clean water worldwide, after agriculture

### What YUME Does About It

- **Upcycling > Recycling:** Instead of breaking materials down, YUME transforms discarded jeans into higher-value pieces — no new raw materials needed
- **Zero waste:** 3 discarded jeans become 1 unique piece. Nothing is wasted.
- **Zero machines:** Everything is hand-sewn, meaning minimal energy consumption
- **Unique by nature:** Every piece is unrepeatable — the opposite of mass production
- **Local production:** Made in São Paulo, no international shipping of materials
- **Each upcycled jean saves ~1,500 gallons of water** compared to producing new denim
- **Extending garment life by just 9 months reduces carbon/water/waste footprint by 20-30%**

### Why This Matters for UX/Copy

- The site should make visitors FEEL the impact, not just read about it
- Use real numbers and comparisons (e.g., "This piece saved 5,670 liters of water")
- Consider a "Impact Counter" component showing cumulative savings across all pieces sold
- The process section (Garimpo → Desconstrução → Reconstrução → Identidade) should emphasize the transformation narrative
- Product pages could show: "This piece was born from 3 jeans that would have gone to a landfill"
- Tone: not preachy or guilt-tripping — more like "we do this because it's the only way that makes sense"
- Target audience (Gen Z / Millennials) cares deeply: 80% of Gen Z believes brands should help people live more sustainably, 73% of Millennials will pay more for sustainable brands

### Suggested Copy Snippets (PT-BR)

- "92 milhões de toneladas de lixo têxtil por ano. A gente transforma parte disso em arte."
- "3 calças descartadas → 1 peça que nunca vai existir de novo."
- "Feito à mão. Sem máquina. Sem pressa. Sem desperdício."
- "Cada peça YUME economiza mais de 5 mil litros de água."
- "A moda mais sustentável é a que já existe. A gente só dá um novo propósito."
- "Zero fábrica. Zero molde. Zero igual."
