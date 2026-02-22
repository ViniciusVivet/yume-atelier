# 🔧 Configurar Supabase no projeto (.env.local)

O erro **"Supabase não configurado"** aparece porque falta o arquivo `.env.local` com a URL e a chave do seu projeto Supabase.

---

## Passo 1: Pegar a URL e a chave no Supabase

1. Abra o **Supabase** no navegador e entre no seu projeto.
2. No menu da esquerda, clique em **Project Settings** (ícone de engrenagem).
3. Clique em **API** no submenu.
4. Na página você verá:
   - **Project URL** — algo como `https://xxxxx.supabase.co`
   - **Project API keys**:
     - **anon public** — use essa no `.env.local` como `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** — use como `SUPABASE_SERVICE_ROLE_KEY` (guarde em segredo, não suba no Git)

Copie e guarde:
- A **Project URL**
- A chave **anon public**
- A chave **service_role** (opcional para o admin, mas útil para scripts)

---

## Passo 2: Criar o arquivo .env.local na raiz do projeto

1. Na raiz do projeto (pasta `yume-atelier`), crie um arquivo chamado **exatamente** `.env.local`.
2. Abra o arquivo e cole o conteúdo abaixo, **trocando** pelos seus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...sua_chave_service_role_aqui
```

Substitua:
- `https://SEU-PROJECT-ID.supabase.co` → pela **Project URL** do Supabase
- `eyJhbGci...` (anon) → pela chave **anon public**
- `eyJhbGci...` (service_role) → pela chave **service_role**

3. Salve o arquivo (Ctrl+S).

---

## Passo 3: Reiniciar o servidor

O Next.js só lê o `.env.local` ao iniciar. Então:

1. No terminal onde está rodando o projeto, aperte **Ctrl+C** para parar.
2. Rode de novo: `npm run dev`
3. Acesse de novo: http://localhost:3002/login

O aviso "Supabase não configurado" deve sumir e o login deve funcionar (se você já criou o usuário e a tabela `admin_users` no Supabase).

---

## Resumo

| Onde está | O que copiar |
|-----------|----------------|
| Supabase → **Project Settings** → **API** | **Project URL** |
| Mesma página → **Project API keys** | **anon public** e **service_role** |
| No seu PC | Criar `.env.local` na raiz do projeto com essas 3 variáveis |

O arquivo `.env.local` **não** vai para o Git (está no `.gitignore`), então suas chaves ficam só na sua máquina.
