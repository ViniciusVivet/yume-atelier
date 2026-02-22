-- Tabela para controlar quais usuários são admins
-- Execute este SQL no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Apenas admins podem ver/gerenciar a lista
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Política: Apenas usuários autenticados podem verificar se são admin
CREATE POLICY "Users can check if they are admin" ON admin_users
  FOR SELECT USING (
    auth.jwt() ->> 'email' = email
  );

-- Política: Apenas service role pode inserir/atualizar/deletar
-- (Isso será feito via SQL direto ou API com service role)

-- Inserir primeiro admin (substitua pelo email que você quer usar)
INSERT INTO admin_users (email)
VALUES ('admin@yumeatelier.com')
ON CONFLICT (email) DO NOTHING;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
