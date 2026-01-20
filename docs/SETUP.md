# 🚀 Guia Rápido de Setup

## Passo a Passo Completo

### 1. Instalação Inicial

```bash
# Instalar dependências
npm install
```

### 2. Configurar Supabase

#### 2.1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (se não tiver)
3. Crie um novo projeto
4. Anote a URL e as chaves (anon key e service role key)

#### 2.2. Executar Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Abra o arquivo `lib/supabase/schema.sql`
3. Cole e execute todo o conteúdo
4. Verifique se as tabelas foram criadas:
   - `products`
   - `categories`
   - `site_settings`

#### 2.3. Configurar Storage

1. No dashboard do Supabase, vá em **Storage**
2. Crie um novo bucket chamado `yume-atelier`
3. Configure as políticas:
   - **Public Access**: Habilitado para leitura
   - **Authenticated Access**: Habilitado para escrita

### 3. Configurar Variáveis de Ambiente

1. Copie `.env.local.example` para `.env.local`
2. Preencha as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

ADMIN_EMAIL=admin@yumeatelier.com
ADMIN_PASSWORD=sua_senha_segura

WHATSAPP_NUMBER=5511999999999
WHATSAPP_MESSAGE_TEMPLATE=Salve! Tenho interesse na peça {PRODUCT_NAME} do YUME Atelier.
```

### 4. Criar Usuário Admin

#### Opção 1: Via Dashboard do Supabase

1. Vá em **Authentication** > **Users**
2. Clique em **Add User**
3. Preencha email e senha
4. Marque como **Email Confirmed**

#### Opção 2: Via SQL

```sql
-- Criar usuário (substitua email e senha)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@yumeatelier.com',
  crypt('sua_senha_aqui', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

### 5. Executar o Projeto

```bash
npm run dev
```

Por padrão o projeto roda em: **`http://localhost:3002`**

### 6. Primeiro Acesso ao Admin

1. Acesse `http://localhost:3002/login`
2. Faça login com o email e senha criados
3. Você será redirecionado para `http://localhost:3002/admin`

> Se o admin ficar redirecionando, confirme que `middleware.ts` está presente e reinicie o servidor.

### 6.1 (Opcional) Modo demonstração
Se você ainda não executou o schema/policies no Supabase, a home vai mostrar um **catálogo demo** para você validar o visual.

### 7. Configurar o Site

1. No admin, vá em **Configurações**
2. Preencha:
   - Título do site
   - Número do WhatsApp
   - Template da mensagem
   - URLs de imagens de fundo (opcional)
3. Salve

### 8. Criar Primeira Categoria

1. No admin, vá em **Categorias**
2. Clique em **+ Nova Categoria**
3. Preencha:
   - Nome (ex: "Peças Únicas")
   - Slug será gerado automaticamente
   - Descrição (opcional)
   - URL da imagem de fundo (opcional)
4. Salve

### 9. Adicionar Primeiro Produto

1. No admin, vá em **Produtos**
2. Clique em **+ Novo Produto**
3. Preencha:
   - Nome
   - Categoria (selecione a criada)
   - Status (Disponível, Sold Out, Sob Encomenda)
   - Descrição
   - Descrição Artística (opcional)
   - Info Técnica (opcional)
   - Preço (opcional)
   - URLs das Imagens (uma por linha)
   - URL do Vídeo Hero (opcional)
4. Salve

### 10. Visualizar no Site

1. Volte para a home `http://localhost:3002`
2. Você verá seus produtos (ou catálogo demo, se ainda não tiver dados)
3. Use **Categorias** (drawer no header) e **Buscar** (overlay)
4. Clique em um produto para ver detalhes/zoom
5. Teste carrinho e WhatsApp

### 10.1 Seed (1 clique)
Depois de logar no admin, acesse `http://localhost:3002/admin/seed` e clique em **Criar Produtos de Teste**.

---

## Troubleshooting

### Erro: "Invalid API key"

- Verifique se as variáveis de ambiente estão corretas
- Confirme que copiou a chave correta do Supabase
- Reinicie o servidor após alterar `.env.local`

### Erro: "relation does not exist"

- Execute o schema SQL novamente
- Verifique se todas as tabelas foram criadas

### Erro: "Unauthorized" no admin

- Verifique se o usuário foi criado corretamente
- Confirme que o email está confirmado
- Tente fazer logout e login novamente

### Imagens não carregam

- Verifique se as URLs estão corretas
- Confirme que as imagens são públicas
- Se usar Supabase Storage, verifique as políticas
- Rode `lib/supabase/mvp_policies.sql` para as policies do bucket (MVP)

### Categorias não aparecem

- Verifique se criou pelo menos uma categoria
- Confirme que a categoria tem produtos associados
- Limpe o cache do navegador

---

## Próximos Passos

1. **Adicione mais produtos** — Crie seu catálogo completo
2. **Customize as imagens de fundo** — Por categoria e global
3. **Configure o WhatsApp** — Use seu número real
4. **Teste em dispositivos móveis** — A experiência é responsiva
5. **Prepare para deploy** — Siga o README.md para deploy na Vercel

---

**Pronto! Seu YUME Atelier está funcionando! 🔮**

