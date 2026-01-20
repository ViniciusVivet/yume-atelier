-- Atualizar número do WhatsApp no site_settings
-- Execute este script no SQL Editor do Supabase

UPDATE site_settings
SET whatsapp_number = '5511986765219'
WHERE id IN (SELECT id FROM site_settings LIMIT 1);

-- Se não existir registro, criar um novo
INSERT INTO site_settings (whatsapp_number, whatsapp_message_template, site_title, site_description)
VALUES (
  '5511986765219',
  'Salve! Tenho interesse na peça {PRODUCT_NAME} do YUME Atelier.',
  'YUME Atelier',
  'Ateliê de Moda Disruptiva'
)
ON CONFLICT DO NOTHING;

