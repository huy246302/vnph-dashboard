-- ============================================================
--  008 — TIGHTEN RLS WRITE POLICIES WITH profiles.status
--  Existing write policies (migration 004) only checked
--  role = 'admin'. This adds status = 'approved' to the same
--  check, so a blocked/pending admin can no longer write via
--  a direct (anon-key) connection, independent of app-level
--  gating in middleware/layout.
-- ============================================================

-- ── Reference tables ──
DROP POLICY IF EXISTS "Only admins can modify national teams" ON national_teams;
CREATE POLICY "Only admins can modify national teams"
  ON national_teams FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify trophies" ON trophies;
CREATE POLICY "Only admins can modify trophies"
  ON trophies FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify awards" ON awards;
CREATE POLICY "Only admins can modify awards"
  ON awards FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

-- ── Player sub-resource tables ──
DROP POLICY IF EXISTS "Only admins can modify player positions" ON player_positions;
CREATE POLICY "Only admins can modify player positions"
  ON player_positions FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify player nicknames" ON player_nicknames;
CREATE POLICY "Only admins can modify player nicknames"
  ON player_nicknames FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify player club history" ON player_club_history;
CREATE POLICY "Only admins can modify player club history"
  ON player_club_history FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify player national team" ON player_national_team;
CREATE POLICY "Only admins can modify player national team"
  ON player_national_team FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify player stats cards" ON player_stats_card;
CREATE POLICY "Only admins can modify player stats cards"
  ON player_stats_card FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify career events" ON career_events;
CREATE POLICY "Only admins can modify career events"
  ON career_events FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify player trophies" ON player_trophies;
CREATE POLICY "Only admins can modify player trophies"
  ON player_trophies FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify player awards" ON player_awards;
CREATE POLICY "Only admins can modify player awards"
  ON player_awards FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify player media" ON player_media;
CREATE POLICY "Only admins can modify player media"
  ON player_media FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

-- ── Curated teams ──
DROP POLICY IF EXISTS "Only admins can modify curated teams" ON curated_teams;
CREATE POLICY "Only admins can modify curated teams"
  ON curated_teams FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));

DROP POLICY IF EXISTS "Only admins can modify curated team players" ON curated_team_players;
CREATE POLICY "Only admins can modify curated team players"
  ON curated_team_players FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.status = 'approved'
  ));