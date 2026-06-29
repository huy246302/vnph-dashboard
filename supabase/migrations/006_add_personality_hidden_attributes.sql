-- ============================================================
--  006 — ADD FM PERSONALITY & HIDDEN PERFORMANCE ATTRIBUTES
--  Adds two new attribute groups to player_stats_card, separate
--  from Technical/Mental/Physical/Goalkeeping. Scale: 1-100
--  (matches existing convention; FM itself uses 1-20 for these).
-- ============================================================

-- ── Personality (7) ──
ALTER TABLE public.player_stats_card
  ADD COLUMN IF NOT EXISTS ambition        smallint CHECK (ambition        BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS controversy     smallint CHECK (controversy     BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS loyalty         smallint CHECK (loyalty         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS pressure        smallint CHECK (pressure        BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS professionalism smallint CHECK (professionalism BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS sportsmanship   smallint CHECK (sportsmanship   BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS temperament     smallint CHECK (temperament     BETWEEN 1 AND 100);

-- ── Hidden Performance (6) ──
ALTER TABLE public.player_stats_card
  ADD COLUMN IF NOT EXISTS consistency       smallint CHECK (consistency       BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS dirtiness         smallint CHECK (dirtiness         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS important_matches smallint CHECK (important_matches BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS injury_proneness  smallint CHECK (injury_proneness  BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS adaptability      smallint CHECK (adaptability      BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS versatility       smallint CHECK (versatility       BETWEEN 1 AND 100);