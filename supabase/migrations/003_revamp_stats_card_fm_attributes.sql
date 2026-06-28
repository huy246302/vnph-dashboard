-- ============================================================
--  003 — REVAMP player_stats_card TO FULL FM ATTRIBUTE SET
--  Scale: 1–100 (FM uses 1–20, this DB uses 1–100)
--  Drops the original 22-attribute custom schema, replaces with
--  the full Football Manager Technical/Mental/Physical/GK set.
-- ============================================================

ALTER TABLE public.player_stats_card
  DROP COLUMN IF EXISTS speed,
  DROP COLUMN IF EXISTS acceleration,
  DROP COLUMN IF EXISTS stamina,
  DROP COLUMN IF EXISTS balance,
  DROP COLUMN IF EXISTS jumping,
  DROP COLUMN IF EXISTS heading,
  DROP COLUMN IF EXISTS attack,
  DROP COLUMN IF EXISTS defense,
  DROP COLUMN IF EXISTS aggression,
  DROP COLUMN IF EXISTS reaction,
  DROP COLUMN IF EXISTS passing,
  DROP COLUMN IF EXISTS dribbling,
  DROP COLUMN IF EXISTS ball_control,
  DROP COLUMN IF EXISTS technique,
  DROP COLUMN IF EXISTS finishing,
  DROP COLUMN IF EXISTS shot_power,
  DROP COLUMN IF EXISTS long_range,
  DROP COLUMN IF EXISTS positioning,
  DROP COLUMN IF EXISTS gk_catching,
  DROP COLUMN IF EXISTS gk_diving,
  DROP COLUMN IF EXISTS gk_reflexes,
  DROP COLUMN IF EXISTS gk_reach;

-- Technical (14)
ALTER TABLE public.player_stats_card
  ADD COLUMN IF NOT EXISTS corners          smallint CHECK (corners          BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS crossing         smallint CHECK (crossing         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS dribbling        smallint CHECK (dribbling        BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS finishing        smallint CHECK (finishing        BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS first_touch      smallint CHECK (first_touch      BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS free_kick_taking smallint CHECK (free_kick_taking BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS heading          smallint CHECK (heading          BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS long_shots       smallint CHECK (long_shots       BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS long_throws      smallint CHECK (long_throws      BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS marking          smallint CHECK (marking          BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS passing          smallint CHECK (passing          BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS penalty_taking   smallint CHECK (penalty_taking   BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS tackling         smallint CHECK (tackling         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS technique        smallint CHECK (technique        BETWEEN 1 AND 100);

-- Mental (14)
ALTER TABLE public.player_stats_card
  ADD COLUMN IF NOT EXISTS aggression    smallint CHECK (aggression    BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS anticipation  smallint CHECK (anticipation  BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS bravery       smallint CHECK (bravery       BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS composure     smallint CHECK (composure     BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS concentration smallint CHECK (concentration BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS decisions     smallint CHECK (decisions     BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS determination smallint CHECK (determination BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS flair         smallint CHECK (flair         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS leadership    smallint CHECK (leadership    BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS off_the_ball  smallint CHECK (off_the_ball  BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS positioning   smallint CHECK (positioning   BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS teamwork      smallint CHECK (teamwork      BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS vision        smallint CHECK (vision        BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS work_rate     smallint CHECK (work_rate     BETWEEN 1 AND 100);

-- Physical (8)
ALTER TABLE public.player_stats_card
  ADD COLUMN IF NOT EXISTS acceleration    smallint CHECK (acceleration    BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS agility         smallint CHECK (agility         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS balance         smallint CHECK (balance         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS jumping_reach   smallint CHECK (jumping_reach   BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS natural_fitness smallint CHECK (natural_fitness BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS pace            smallint CHECK (pace            BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS stamina         smallint CHECK (stamina         BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS strength        smallint CHECK (strength        BETWEEN 1 AND 100);

-- Goalkeeping (13)
ALTER TABLE public.player_stats_card
  ADD COLUMN IF NOT EXISTS gk_aerial_reach      smallint CHECK (gk_aerial_reach      BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_command_of_area   smallint CHECK (gk_command_of_area   BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_communication     smallint CHECK (gk_communication     BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_eccentricity      smallint CHECK (gk_eccentricity      BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_first_touch       smallint CHECK (gk_first_touch       BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_handling          smallint CHECK (gk_handling          BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_kicking           smallint CHECK (gk_kicking           BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_one_on_ones       smallint CHECK (gk_one_on_ones       BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_passing           smallint CHECK (gk_passing           BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_tendency_to_punch smallint CHECK (gk_tendency_to_punch BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_reflexes          smallint CHECK (gk_reflexes          BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_rushing_out       smallint CHECK (gk_rushing_out       BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS gk_throwing          smallint CHECK (gk_throwing          BETWEEN 1 AND 100);