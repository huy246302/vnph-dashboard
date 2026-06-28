-- ============================================================
--  001 — INITIAL EXTENDED SCHEMA
--  Adds the supporting tables and player columns beyond the
--  original players/clubs/profiles/player_club_history base.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.national_teams (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  short_name  text,
  country     text NOT NULL,
  logo_url    text,
  created_at  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT national_teams_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.trophies (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  short_name  text,
  description text,
  level       text CHECK (level = ANY (ARRAY[
                'world','continental','national',
                'domestic_cup','domestic_league','other'
              ])),
  CONSTRAINT trophies_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.awards (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  short_name  text,
  description text,
  scope       text CHECK (scope = ANY (ARRAY['world','continental','national','other'])),
  CONSTRAINT awards_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.player_positions (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id  uuid NOT NULL,
  position   text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  CONSTRAINT player_positions_pkey PRIMARY KEY (id),
  CONSTRAINT player_positions_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);

CREATE TABLE IF NOT EXISTS public.player_nicknames (
  id        uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  nickname  text NOT NULL,
  CONSTRAINT player_nicknames_pkey PRIMARY KEY (id),
  CONSTRAINT player_nicknames_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);

CREATE TABLE IF NOT EXISTS public.player_national_team (
  id                uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id         uuid NOT NULL,
  national_team_id  uuid NOT NULL,
  caps              integer NOT NULL DEFAULT 0,
  goals             integer NOT NULL DEFAULT 0,
  debut_date        date,
  last_match_date   date,
  CONSTRAINT player_national_team_pkey PRIMARY KEY (id),
  CONSTRAINT player_national_team_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id),
  CONSTRAINT player_national_team_national_team_id_fkey FOREIGN KEY (national_team_id) REFERENCES public.national_teams(id)
);

CREATE TABLE IF NOT EXISTS public.career_events (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id   uuid NOT NULL,
  event_year  integer NOT NULL,
  event_month integer CHECK (event_month >= 1 AND event_month <= 12),
  title       text NOT NULL,
  description text,
  event_type  text CHECK (event_type = ANY (ARRAY[
                'transfer','debut','trophy','award',
                'injury','retirement','other'
              ])),
  CONSTRAINT career_events_pkey PRIMARY KEY (id),
  CONSTRAINT career_events_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);

CREATE TABLE IF NOT EXISTS public.player_trophies (
  id        uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  trophy_id uuid NOT NULL,
  club_id   uuid,
  year      integer,
  notes     text,
  CONSTRAINT player_trophies_pkey PRIMARY KEY (id),
  CONSTRAINT player_trophies_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id),
  CONSTRAINT player_trophies_trophy_id_fkey FOREIGN KEY (trophy_id) REFERENCES public.trophies(id),
  CONSTRAINT player_trophies_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id)
);

CREATE TABLE IF NOT EXISTS public.player_awards (
  id        uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  award_id  uuid NOT NULL,
  year      integer,
  notes     text,
  CONSTRAINT player_awards_pkey PRIMARY KEY (id),
  CONSTRAINT player_awards_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id),
  CONSTRAINT player_awards_award_id_fkey FOREIGN KEY (award_id) REFERENCES public.awards(id)
);

CREATE TABLE IF NOT EXISTS public.player_media (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id  uuid NOT NULL,
  image_url  text NOT NULL,
  caption    text,
  year       integer,
  media_type text NOT NULL DEFAULT 'photo' CHECK (media_type = ANY (ARRAY['photo','video_thumbnail'])),
  CONSTRAINT player_media_pkey PRIMARY KEY (id),
  CONSTRAINT player_media_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);

CREATE TABLE IF NOT EXISTS public.curated_teams (
  id               uuid NOT NULL DEFAULT gen_random_uuid(),
  slug             text NOT NULL UNIQUE,
  title            text NOT NULL,
  description      text,
  team_type        text NOT NULL DEFAULT 'all_stars' CHECK (team_type = ANY (ARRAY['era','all_stars','custom'])),
  category         text NOT NULL DEFAULT 'club' CHECK (category = ANY (ARRAY['club','national','other'])),
  club_id          uuid,
  national_team_id uuid,
  era_label        text,
  formation        text,
  created_by       uuid,
  is_verified      boolean NOT NULL DEFAULT false,
  created_at       timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT curated_teams_pkey PRIMARY KEY (id),
  CONSTRAINT curated_teams_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id),
  CONSTRAINT curated_teams_national_team_id_fkey FOREIGN KEY (national_team_id) REFERENCES public.national_teams(id),
  CONSTRAINT curated_teams_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.curated_team_players (
  id             uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id        uuid NOT NULL,
  player_id      uuid NOT NULL,
  position_slot  text,
  formation_slot integer,
  is_substitute  boolean NOT NULL DEFAULT false,
  CONSTRAINT curated_team_players_pkey PRIMARY KEY (id),
  CONSTRAINT curated_team_players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.curated_teams(id),
  CONSTRAINT curated_team_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);

-- Players extra fields
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS birth_place         text,
ADD COLUMN IF NOT EXISTS death_date          date,
ADD COLUMN IF NOT EXISTS weight_kg           integer,
ADD COLUMN IF NOT EXISTS primary_era         text CHECK (primary_era = ANY (ARRAY[
                                              'pre-1930s','1930s','1940s','1950s','1960s',
                                              '1970s','1980s','1990s','2000s','2010s','2020s'
                                            ])),
ADD COLUMN IF NOT EXISTS legacy_bio          text,
ADD COLUMN IF NOT EXISTS playing_style       text,
ADD COLUMN IF NOT EXISTS career_start_year   integer,
ADD COLUMN IF NOT EXISTS career_end_year     integer,
ADD COLUMN IF NOT EXISTS is_retired          boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS retired_year        integer;

-- Player club history extra fields
ALTER TABLE public.player_club_history
ADD COLUMN IF NOT EXISTS appearances  integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS goals        integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS assists      integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_captain   boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS notes        text;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_players_primary_era   ON public.players (primary_era);
CREATE INDEX IF NOT EXISTS idx_players_is_retired     ON public.players (is_retired);
CREATE INDEX IF NOT EXISTS idx_player_national_team   ON public.player_national_team (player_id);
CREATE INDEX IF NOT EXISTS idx_player_trophies        ON public.player_trophies (player_id);
CREATE INDEX IF NOT EXISTS idx_player_awards          ON public.player_awards (player_id);
CREATE INDEX IF NOT EXISTS idx_career_events          ON public.career_events (player_id, event_year);
CREATE INDEX IF NOT EXISTS idx_curated_team_players   ON public.curated_team_players (team_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_players_updated_at ON public.players;
CREATE TRIGGER trg_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();