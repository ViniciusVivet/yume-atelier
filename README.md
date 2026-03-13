## 🔮 YUME Atelier

**Catálogo imersivo de moda experimental** — pensado como um case pronto para apresentar a clientes de moda, arte e lifestyle que querem algo **além de uma loja comum**.

Este repositório entrega um projeto real, usado como vitrine de proposta de valor em:

- **Apresentações comerciais** (mostrar rapidamente “como ficaria o site do cliente”)
- **Provas de conceito** (MVP navegável em poucos minutos)
- **Portfólio premium** (UX cinematográfica com estética cyberpunk)

Ele já está pronto para ser:

- **Clonado, configurado e rebatizado** com a marca do seu cliente;
- **Apresentado em reunião** com dados demo ou dados reais;
- **Evoluído para e‑commerce completo** se o cliente aprovar o conceito.

---

## 💼 Para quem é este case

- **Estúdios / freelancers de produto digital** que atendem moda, arte, streetwear, joalheria e marcas autorais.
- **Ateliês e marcas independentes** que querem uma vitrine forte, mesmo sem equipe técnica.
- **Produtoras e agências** que precisam de um **demo convincente** para fechar contrato antes do desenvolvimento sob medida.

---

## ✨ Proposta de valor (em 30s)

- **Catálogo estilo “loja”, sem a fricção de um e‑commerce**: navegação rápida, zoom, estados “sold out / sob encomenda”, mas o fechamento é via **WhatsApp** — perfeito para ateliês que ainda preferem conversa direta.
- **Visual cinematográfico, pronto para vender**: cards 3D, blur, glow, transições de página e um **dark mode cyberpunk** que destaca fotos de moda.
- **Painel admin dentro do próprio site**: o cliente **não precisa de painel Supabase** no dia a dia. Ele gerencia produtos, categorias e configurações visuais em `/admin`.
- **Modo demonstração automático**: se o Supabase não estiver configurado, o site entra em **demo mode** com produtos fictícios — ótimo para mostrar o visual sem depender de infra.

Se você abrir o deploy na Vercel e navegar 2 minutos, já tem um **tour completo para mostrar em call de vendas**.

---

## 🎥 Experiência do cliente final

- **Home imersiva** com:
  - Grid animado de produtos;
  - Categorias em drawer lateral;
  - Busca fullscreen com filtros de status.
- **Página de produto**:
  - Galeria de imagens e/ou vídeo hero;
  - Descrição artística + ficha técnica;
  - CTA direto para **WhatsApp** com mensagem já preenchida.
- **Carrinho local** (opcional):
  - Itens permanecem com o usuário (localStorage);
  - Resumo enviado no texto do WhatsApp.

Nada de cadastro, senha ou checkout complexo: a ideia é **aproximar o contato humano**, não substituí‑lo.

---

## 🧑‍💻 Experiência do admin (seu cliente)

O fluxo foi desenhado para um cliente **não técnico**:

- Acessa `/login` com email e senha.
- Se o email estiver em `admin_users` no Supabase, entra no painel `/admin`.
- Dentro do admin ele pode:
  - **Criar/editar produtos** (nome, preço opcional, status, descrições, imagens, vídeo hero, ordem de exibição).
  - **Gerenciar categorias** (nome, background da categoria, ordem).
  - **Configurar o site** (título, descrição, número e template de WhatsApp, fundos globais).
  - **Popular com dados de teste** via `/admin/seed`.

Tudo isso **sem** encostar em `.env`, painel Supabase ou código.  
Mais detalhes “para o cliente” estão em `docs/PARA_O_CLIENTE.md`.

---

## 🧱 Arquitetura em 1 minuto

- **Frontend**
  - Next.js 14 (App Router, Server Components onde faz sentido)
  - TypeScript
  - Tailwind CSS (tema `cyber` customizado)
  - Framer Motion (animações finas de entrada, hover 3D, transições de página)

- **Backend / CMS**
  - Supabase (PostgreSQL + Storage + Auth)
  - Tabelas principais: `products`, `categories`, `site_settings`, `admin_users`
  - RLS e políticas básicas em `lib/supabase/mvp_policies.sql`

- **Infra**
  - Vercel para o frontend
  - Supabase para dados e arquivos

Arquitetura completa e decisões de design: veja `docs/ARCHITECTURE.md` e `docs/ANALISE_PROJETO.md`.

---

## 🧪 Como testar rápido (sem configurar nada pesado)

1. **Clonar e instalar**

```bash
git clone <seu-repositorio>
cd yume-atelier
npm install
```

2. **Rodar em modo demo**

Se você ainda não configurou Supabase, simplesmente rode:

```bash
npm run dev
```

e acesse `http://localhost:3002`.  
O site detecta ausência de Supabase e usa **dados demo** para:

- Produtos;
- Categorias;
- Configurações de fundo.

Isso já é suficiente para **mostrar o visual para um cliente**.

3. **Habilitar backend real (quando for apresentar “valendo”)**

- Siga `docs/SETUP.md` (guia passo a passo) e `docs/CONFIGURAR_ENV.md`.
- Rode os scripts SQL de schema e policies:
  - `lib/supabase/schema.sql`
  - `lib/supabase/mvp_policies.sql`
  - `lib/supabase/admin_users.sql` (para admins)

Depois disso, você pode criar o primeiro admin e entregar credenciais para o seu cliente.

---

## 🛠️ Stack técnica (resumo)

- **Next.js 14**, **TypeScript**, **Tailwind**, **Framer Motion**
- **Supabase** (Postgres, Storage, Auth, RLS)
- **Middleware** de sessão para SSR enxergar login
- **Contexts** para carrinho, categorias, configurações do site e toasts
- **Fallback demo mode** quando o backend estiver offline ou ainda não configurado

Scripts principais:

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servidor de produção
npm run lint     # lint
npm run seed     # cria produtos de teste (quando Supabase configurado)
```

---

## 📁 Mapa rápido de pastas

```text
yume-atelier/
├── app/                 # Rotas e páginas (Next.js App Router)
├── components/          # Componentes de UI (store, admin, landing, ui)
├── contexts/            # Contextos React (carrinho, categorias, etc.)
├── lib/
│   ├── supabase/        # Client/server, schema, policies, seed
│   ├── demo/            # Dados demo
│   ├── types/           # Tipos de domínio
│   └── utils/           # Helpers (WhatsApp, timeout, admin, etc.)
├── docs/                # Documentação para dev e para cliente
└── scripts/             # Scripts auxiliares (seed local, etc.)
```

Para uma visão mais detalhada, veja:

- `docs/PROJECT_SUMMARY.md`
- `docs/IMPLEMENTACOES_COMPLETAS.md`
- `docs/RELATORIO_PRODUCAO.md`

---

## 🚀 Como usar este projeto como “case de vendas”

- **Antes da call**
  - Configure um deploy na Vercel com modo demo funcionando.
  - Troque textos básicos (título, descrição, CTA de WhatsApp) para ficar com a cara do cliente.

- **Durante a call**
  - Comece pela **home**, mostrando grid, categorias, busca e animações.
  - Abra uma **página de produto** com fotos bonitas (mesmo que sejam mockups).
  - Mostre o fluxo de **WhatsApp**, reforçando que o atendimento continua humano.
  - Se fizer sentido, mostre em 1 minuto o **painel admin** (`/admin`) para provar que o cliente consegue manter sozinho.

- **Depois da call**
  - Se o cliente gostou, você pode:
    - Adaptar layout e branding;
    - Evoluir para checkout real (Stripe/Pix);
    - Adicionar analytics, favoritos, variações de produto, etc.  
      (idéias já mapeadas em `docs/ANALISE_PROJETO.md`).

---

## 📄 Licença e créditos

Este é um projeto autoral, pensado como base de estudo e como **case comercial**.  
Todos os direitos reservados ao autor original do YUME Atelier.

Se você reutilizar como base para seus próprios trabalhos, é de boa prática manter referência ao projeto nas apresentações técnicas ou no rodapé (quando fizer sentido comercialmente).

---

## 👤 Autor

**Orbitamos** — Moda Experimental

**Feito com 🔮 para experiências digitais únicas.**


