# 🚀 Setup do Primeiro Admin — Passo a Passo

Você está no Supabase. Siga na ordem.

---

## Parte 1: Criar a tabela de admins (SQL Editor)

1. No menu lateral do Supabase, clique em **SQL Editor** (ícone de código `</>`).

2. Clique em **New query** (ou “Nova consulta”).

3. Abra no seu projeto o arquivo:
   ```
   lib/supabase/admin_users.sql
   ```
   Copie **todo** o conteúdo desse arquivo.

4. No SQL Editor do Supabase, **cole** o conteúdo.

5. **Troque o email do admin** (opcional):
   - Procure a linha: `VALUES ('admin@yumeatelier.com')`
   - Troque `admin@yumeatelier.com` pelo **seu email** (o que você vai usar para entrar no painel).
   - Exemplo: `VALUES ('seuemail@gmail.com')`

6. Clique no botão **Run** (ou **Execute**) no canto inferior direito.

7. Deve aparecer algo como “Success” ou “Success. No rows returned”.  
   Se der erro, copie a mensagem e me envie.

---

## Parte 2: Criar o usuário na autenticação (Authentication)

1. No menu lateral, clique em **Authentication** (ícone de pessoa).

2. Clique na aba **Users** (Usuários).

3. Clique no botão **Add user** (ou “Adicionar usuário”).

4. Escolha **Create new user** (criar novo usuário).

5. Preencha:
   - **Email:** o **mesmo email** que você colocou no SQL (ex: `seuemail@gmail.com`).
   - **Password:** uma senha forte (mínimo 6 caracteres). Anote em um lugar seguro.

6. Marque a opção **Auto Confirm User** (confirmar email automaticamente).  
   Assim você não precisa clicar em link de confirmação.

7. Clique em **Create user** (ou “Criar usuário”).

8. O usuário deve aparecer na lista. Pronto.

---

## Parte 3: Conferir se o email está na tabela de admins

1. Volte no **SQL Editor**.

2. Cole e execute este comando (troque pelo seu email):

```sql
SELECT * FROM admin_users;
```

3. Deve aparecer uma linha com o email que você usou.  
   Se não aparecer, execute de novo o `INSERT` do arquivo `admin_users.sql`, mas com **seu** email na linha do `VALUES`.

---

## Parte 4: Testar no site

1. No seu projeto, rode o site (por exemplo: `npm run dev`).

2. Acesse: **http://localhost:3002/login**

3. Clique em **“Já tem uma conta? Entrar”** (ou use a tela de login).

4. Digite o **mesmo email** e a **senha** que você criou no Supabase.

5. Clique em **Entrar**.

6. Você deve ser redirecionado para o **painel admin** (`/admin`).  
   Se for redirecionado para a home ou der “Acesso negado”, volte na Parte 1 e na Parte 3 e confira se o email está igual em todo lugar (SQL, Auth e login).

---

## Resumo rápido

| Onde              | O que fazer |
|-------------------|------------|
| **SQL Editor**   | Rodar o `admin_users.sql` e colocar **seu** email no `INSERT`. |
| **Authentication > Users** | Criar usuário com esse **mesmo** email e uma senha. Marcar **Auto Confirm User**. |
| **Site /login**   | Entrar com esse email e senha. |

---

## Erros comuns

- **“Acesso negado”**  
  O email que você usa para logar não está na tabela `admin_users`.  
  Execute de novo: `INSERT INTO admin_users (email) VALUES ('seu@email.com');` (com seu email).

- **“Invalid login credentials”**  
  Email ou senha errados, ou o usuário não foi criado em Authentication > Users.

- **“Email not confirmed”**  
  Na criação do usuário, não marcou **Auto Confirm User**.  
  Em Authentication > Users, abra o usuário e confirme o email manualmente.

Se travar em algum passo, diga em qual (ex: “Parte 1, passo 5”) e o que aparece na tela que eu te guio no próximo clique.
