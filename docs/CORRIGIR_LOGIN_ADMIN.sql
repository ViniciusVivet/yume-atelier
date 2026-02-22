-- Cole no SQL Editor do Supabase e execute.
-- Isso garante que admin@teste.com tenha acesso ao painel admin.

INSERT INTO admin_users (email)
VALUES ('admin@teste.com')
ON CONFLICT (email) DO NOTHING;

-- Conferir:
-- SELECT * FROM admin_users;
