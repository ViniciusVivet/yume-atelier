-- Cole isso no SQL Editor do Supabase e execute

-- Criar usuário admin
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
  'admin@yume.com',  -- SEU EMAIL
  crypt('Camalas5!', gen_salt('bf')),  -- SUA SENHA
  NOW(),
  NOW(),
  NOW()
);

