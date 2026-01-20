-- YUME Atelier - MVP Policies (Public Read + Authenticated Write)
-- Rode no Supabase SQL Editor após o schema.sql

-- Tables: allow public read
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read products" ON public.products;
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;

CREATE POLICY "Public can read products"
ON public.products
FOR SELECT
USING (true);

CREATE POLICY "Public can read categories"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Public can read site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- MVP write access: any authenticated user can manage (good enough for single-owner store)
DROP POLICY IF EXISTS "Authenticated can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated can manage site_settings" ON public.site_settings;

CREATE POLICY "Authenticated can manage products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can manage site_settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage (Bucket: yume-atelier)
-- IMPORTANT: create the bucket first in Storage UI: yume-atelier
-- Public can read objects
DROP POLICY IF EXISTS "Public read yume-atelier" ON storage.objects;
CREATE POLICY "Public read yume-atelier"
ON storage.objects
FOR SELECT
USING (bucket_id = 'yume-atelier');

-- Authenticated can upload/update/delete
DROP POLICY IF EXISTS "Authenticated write yume-atelier" ON storage.objects;
CREATE POLICY "Authenticated write yume-atelier"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'yume-atelier')
WITH CHECK (bucket_id = 'yume-atelier');


