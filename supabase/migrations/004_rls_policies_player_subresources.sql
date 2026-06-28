-- ============================================================
--  004 — RLS POLICIES FOR REFERENCE AND PLAYER SUB-RESOURCE TABLES
--  Pattern: public SELECT for everyone, ALL (write) restricted
--  to users with role = 'admin' in profiles. Service-role admin
--  client used by server actions bypasses these automatically.
-- ============================================================

-- ── Reference tables ──
CREATE POLICY IF NOT EXISTS "National teams are viewable by everyone"
  ON national_teams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify national teams"
  ON national_teams FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Trophies are viewable by everyone"
  ON trophies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify trophies"
  ON trophies FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Awards are viewable by everyone"
  ON awards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify awards"
  ON awards FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ── Player sub-resource tables ──
CREATE POLICY IF NOT EXISTS "Player positions are viewable by everyone"
  ON player_positions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player positions"
  ON player_positions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Player nicknames are viewable by everyone"
  ON player_nicknames FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player nicknames"
  ON player_nicknames FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Player club history is viewable by everyone"
  ON player_club_history FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player club history"
  ON player_club_history FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Player national team is viewable by everyone"
  ON player_national_team FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player national team"
  ON player_national_team FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Player stats cards are viewable by everyone"
  ON player_stats_card FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player stats cards"
  ON player_stats_card FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Career events are viewable by everyone"
  ON career_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify career events"
  ON career_events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Player trophies are viewable by everyone"
  ON player_trophies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player trophies"
  ON player_trophies FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Player awards are viewable by everyone"
  ON player_awards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player awards"
  ON player_awards FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Player media is viewable by everyone"
  ON player_media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify player media"
  ON player_media FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ── Curated teams ──
CREATE POLICY IF NOT EXISTS "Curated teams are viewable by everyone"
  ON curated_teams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify curated teams"
  ON curated_teams FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Curated team players are viewable by everyone"
  ON curated_team_players FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Only admins can modify curated team players"
  ON curated_team_players FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));