# 👤 Para o seu cliente (quem vai usar o site)

Este doc explica **quem faz o quê**. Seu cliente **não** precisa de `.env` nem saber programar.

---

## Quem configura o quê

| Quem | O que faz | Precisa de .env? |
|------|-----------|------------------|
| **Você (dev)** | Cria o projeto, faz deploy (ex: Vercel), configura variáveis de ambiente **uma vez** no painel da Vercel. | Só no seu PC para desenvolver; em produção usa o painel da Vercel. |
| **Seu cliente** | Acessa o site no navegador, faz login com email e senha, usa o painel admin. | **Não.** Só abre o link do site. |

Ou seja: **o cliente nunca mexe em .env**. Ele só usa o site.

---

## Como o cliente usa o site (já está assim)

1. Você entrega o site em um link (ex: `https://yume-atelier.vercel.app`).
2. O cliente abre esse link no **navegador** (Chrome, etc.).
3. Para entrar no **painel admin**, ele vai em **Login** (ou `/login`), coloca **email** e **senha**.
4. Se o email estiver na lista de admins (tabela `admin_users` no Supabase), ele entra no admin.  
5. Nada disso depende de arquivo no PC do cliente.

O login de admins **já não depende de .env no PC do cliente**. Depende só de:
- o site estar no ar (com as variáveis configuradas no servidor, por você);
- o cliente ter um usuário criado no Supabase Auth;
- o email dele estar na tabela `admin_users` (você ou um outro admin adiciona).

---

## O que você precisa fazer uma vez (para “entregar” o projeto)

1. **Deploy**  
   Subir o projeto na Vercel (ou outro host).

2. **Variáveis de ambiente em produção**  
   No painel da Vercel (ou do host):  
   **Settings → Environment Variables**  
   Colocar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`  
   (com os valores do **mesmo** projeto Supabase que você já usa.)

3. **Primeiro admin**  
   No Supabase: criar o usuário do cliente em **Authentication → Users** e adicionar o email em **admin_users** (via SQL ou Table Editor).  
   Depois você passa para o cliente: **link do site + email + senha**. Ele só usa isso no navegador.

Depois disso, o cliente usa o site normalmente, sem .env e sem codar.

---

## Resumo

- **.env** = configuração técnica (conexão com Supabase). Quem mexe é **quem desenvolve/deploya**, não o cliente.
- **Login de admin** = já implementado: email/senha no site; lista de admins no Supabase (`admin_users`).
- **Seu cliente** = só acessa o link, faz login e usa. Não depende de .env no PC dele.
