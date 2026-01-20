-- Execute este SQL no Supabase SQL Editor para criar usuário admin
-- Substitua email e senha se quiser

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
  'admin@yume.com',
  crypt('Camalas5!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
