-- ============================================================
--  005 — STORAGE BUCKET POLICIES
--  Buckets (club-logos, national-team-logos, player-photos) must
--  be created manually in the Supabase dashboard first, with
--  "Public bucket" enabled. This migration only adds the
--  upload/update/delete policies.
-- ============================================================

-- ── club-logos ──
CREATE POLICY IF NOT EXISTS "Anyone can view club logos"
  ON storage.objects FOR SELECT USING (bucket_id = 'club-logos');
CREATE POLICY IF NOT EXISTS "Authenticated users can upload club logos"
  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'club-logos');
CREATE POLICY IF NOT EXISTS "Authenticated users can update club logos"
  ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'club-logos');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete club logos"
  ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'club-logos');

-- ── national-team-logos ──
CREATE POLICY IF NOT EXISTS "Anyone can view national team logos"
  ON storage.objects FOR SELECT USING (bucket_id = 'national-team-logos');
CREATE POLICY IF NOT EXISTS "Authenticated users can upload national team logos"
  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'national-team-logos');
CREATE POLICY IF NOT EXISTS "Authenticated users can update national team logos"
  ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'national-team-logos');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete national team logos"
  ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'national-team-logos');

-- ── player-photos ──
CREATE POLICY IF NOT EXISTS "Anyone can view player photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'player-photos');
CREATE POLICY IF NOT EXISTS "Authenticated users can upload player photos"
  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'player-photos');
CREATE POLICY IF NOT EXISTS "Authenticated users can update player photos"
  ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'player-photos');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete player photos"
  ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'player-photos');