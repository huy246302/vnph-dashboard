-- ============================================================
--  009 — RESTRICT READS TO APPROVED, LOGGED-IN USERS ONLY
--  Previously: FOR SELECT TO anon, authenticated USING (true)
--  Now: only authenticated users with profiles.status = 'approved'
--  can read. Anonymous (anon-key, no session) requests are fully
--  blocked. Can be reopened later if a public site is built.
-- ============================================================

-- ── Reference tables ──
DROP POLICY IF EXISTS "National teams are viewable by everyone" ON national_teams;
CREATE POLICY "National teams are viewable by approved users"
  ON national_teams FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Trophies are viewable by everyone" ON trophies;
CREATE POLICY "Trophies are viewable by approved users"
  ON trophies FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Awards are viewable by everyone" ON awards;
CREATE POLICY "Awards are viewable by approved users"
  ON awards FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

-- ── Player sub-resource tables ──
DROP POLICY IF EXISTS "Player positions are viewable by everyone" ON player_positions;
CREATE POLICY "Player positions are viewable by approved users"
  ON player_positions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Player nicknames are viewable by everyone" ON player_nicknames;
CREATE POLICY "Player nicknames are viewable by approved users"
  ON player_nicknames FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Player club history is viewable by everyone" ON player_club_history;
CREATE POLICY "Player club history is viewable by approved users"
  ON player_club_history FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Player national team is viewable by everyone" ON player_national_team;
CREATE POLICY "Player national team is viewable by approved users"
  ON player_national_team FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Player stats cards are viewable by everyone" ON player_stats_card;
CREATE POLICY "Player stats cards are viewable by approved users"
  ON player_stats_card FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Career events are viewable by everyone" ON career_events;
CREATE POLICY "Career events are viewable by approved users"
  ON career_events FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Player trophies are viewable by everyone" ON player_trophies;
CREATE POLICY "Player trophies are viewable by approved users"
  ON player_trophies FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Player awards are viewable by everyone" ON player_awards;
CREATE POLICY "Player awards are viewable by approved users"
  ON player_awards FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Player media is viewable by everyone" ON player_media;
CREATE POLICY "Player media is viewable by approved users"
  ON player_media FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

-- ── Curated teams ──
DROP POLICY IF EXISTS "Curated teams are viewable by everyone" ON curated_teams;
CREATE POLICY "Curated teams are viewable by approved users"
  ON curated_teams FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Curated team players are viewable by everyone" ON curated_team_players;
CREATE POLICY "Curated team players are viewable by approved users"
  ON curated_team_players FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

-- ── players table itself ──
-- The base `players` table's own SELECT policy wasn't included in
-- migration 004 (only sub-resources were). If `players` currently
-- has no RLS enabled, or an open policy, lock it down the same way.
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Players are viewable by everyone" ON public.players;
CREATE POLICY "Players are viewable by approved users"
  ON public.players FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));

-- ── clubs table itself ──
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clubs are viewable by everyone" ON public.clubs;
CREATE POLICY "Clubs are viewable by approved users"
  ON public.clubs FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.status = 'approved'
  ));