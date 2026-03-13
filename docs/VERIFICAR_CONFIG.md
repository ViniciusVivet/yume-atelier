# 🔍 Verificação Rápida

## Problema: "Failed to fetch" ou "ERR_NAME_NOT_RESOLVED"

Isso acontece quando o Next.js não está lendo as variáveis do `.env.local`.

## ✅ SOLUÇÃO RÁPIDA:

### 1. **PARE o servidor** (Ctrl+C no terminal)

### 2. **Verifique o `.env.local`**:
```bash
# Execute no terminal:
Get-Content .env.local
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=https://vhrvpbamcfmrvttqkkeo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

### 3. **REINICIE o servidor**:
```bash
npm run dev
```

### 4. **Teste novamente**:
- Acesse `http://localhost:3002/login`
- Tente fazer login com as credenciais que você criou no Supabase

---

## Se ainda não funcionar:

### Verifique no Supabase Dashboard:
1. Vá em **Authentication** > **Users**
2. Confirme que o usuário existe
3. Confirme que o email está verificado (deve ter um check verde)

### Se o usuário não estiver verificado:
1. Clique no usuário
2. Marque "Email Confirmed" como `true`
3. Salve

### Ou crie um novo usuário pelo Dashboard:
1. **Authentication** > **Users** > **Add User**
2. Email: `admin@yume.com`
3. Senha: `Camalas5!`
4. ✅ Marque **"Auto Confirm User"**
5. Clique em **Create User**

---

## Teste de Conexão:

Se quiser testar se o Supabase está acessível, abra o console do navegador (F12) e digite:

```javascript
fetch('https://vhrvpbamcfmrvttqkkeo.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'sua_anon_key_aqui'
  }
})
```

Se der erro, o problema é de rede/firewall.

---

## Login falha na Vercel (produção) mas o Supabase está “healthy”

Se o login funciona em localhost mas em **https://yume-atelier.vercel.app** aparece erro (ex.: “Erro temporário no servidor” ou “Email ou senha incorretos” mesmo com credenciais certas), faça estes passos:

### 1. Variáveis de ambiente na Vercel

1. Vercel → seu projeto → **Settings** → **Environment Variables**
2. Confirme que existem e estão corretos (para **Production**):
   - `NEXT_PUBLIC_SUPABASE_URL` = URL do seu projeto (ex: `https://xxxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave **anon/public**
3. Se alterar algo, faça **Redeploy** (Deployments → ⋮ no último deploy → Redeploy).

### 2. URL do site no Supabase (muito comum)

O Supabase só aceita login de origens permitidas. Se a URL da Vercel não estiver cadastrada, o auth pode falhar com erro genérico.

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL:** coloque a URL de produção, ex: `https://yume-atelier.vercel.app`
3. **Redirect URLs:** adicione (uma por linha):
   - `https://yume-atelier.vercel.app`
   - `https://yume-atelier.vercel.app/**`
4. Salve e tente o login de novo.

### 3. Usuário existe e está confirmado

1. Supabase → **Authentication** → **Users**
2. Confirme que existe um usuário com o **mesmo email** que você usa no login (ex: `admin@teste.com`).
3. O usuário deve estar **confirmado** (Email Confirmed). Se não estiver, edite o usuário e marque **Auto Confirm User** / “Email confirmed”.

### 4. Ver o erro real no console

Depois do próximo deploy, abra o site da Vercel, vá em **Login**, abra o **Console** (F12 → Console) e tente logar. Você deve ver algo como:

`[YUME Login] ... (raw: ...)`

O trecho **raw** é a mensagem que o Supabase devolveu. Isso ajuda a saber se é “Invalid login credentials”, erro de rede, de JWT, etc.

---

## Criar conta direto (sem confirmar email)

Por padrao o Supabase pode exigir que o usuario confirme o email antes de entrar. Para a pessoa **criar a conta e ja entrar** sem clicar em link de email:

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Desmarque **"Confirm email"** (ou ative **"Auto Confirm"**).
3. Salve.

Depois disso, ao clicar em "Criar Conta" no site, o usuario recebe sessao na hora e e redirecionado para a loja. O **painel admin** continua restrito a quem estiver na tabela `admin_users` (um administrador pode adicionar o email la quando quiser liberar acesso).

