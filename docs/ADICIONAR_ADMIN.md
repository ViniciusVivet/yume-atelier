# 🔐 Como Adicionar um Novo Admin

## Método 1: Via SQL (Recomendado)

1. Acesse o **Supabase Dashboard** > **SQL Editor**
2. Execute o seguinte SQL:

```sql
INSERT INTO admin_users (email)
VALUES ('seu-email@exemplo.com')
ON CONFLICT (email) DO NOTHING;
```

3. O usuário precisa fazer login com esse email para ter acesso ao admin.

## Método 2: Via Dashboard do Supabase

1. Acesse **Supabase Dashboard** > **Table Editor**
2. Selecione a tabela `admin_users`
3. Clique em **Insert** > **Insert row**
4. Preencha o campo `email` com o email do admin
5. Salve

## Método 3: Criar Usuário + Tornar Admin

### Passo 1: Criar o usuário no Supabase Auth

1. **Supabase Dashboard** > **Authentication** > **Users**
2. Clique em **Add User**
3. Preencha email e senha
4. Marque **Email Confirmed**
5. Clique em **Create User**

### Passo 2: Adicionar à lista de admins

Execute no SQL Editor:

```sql
INSERT INTO admin_users (email)
VALUES ('email-do-usuario@exemplo.com')
ON CONFLICT (email) DO NOTHING;
```

---

## ⚠️ Importante

- **Apenas emails na tabela `admin_users` têm acesso ao `/admin`**
- Usuários que criam conta pelo site **NÃO** viram admin automaticamente
- Para dar acesso admin, você precisa adicionar o email manualmente na tabela

---

## 🔒 Segurança

- A tabela `admin_users` tem RLS (Row Level Security) habilitado
- Usuários só podem verificar se **eles mesmos** são admin
- Apenas service role pode inserir/atualizar/deletar (via SQL ou API protegida)
