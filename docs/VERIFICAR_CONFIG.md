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

