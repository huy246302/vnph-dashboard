-- 010_add_player_position_code.sql
-- Add a language-neutral position code next to the existing Vietnamese
-- `position` text. The old column stays untouched so the public site keeps
-- working. See DECISIONS.md (position codes).

alter table public.players
  add column if not exists position_code text
  check (position_code in ('GK', 'DF', 'MF', 'FW'));

-- Backfill from the existing Vietnamese values.
update public.players
set position_code = case position
  when 'Thủ môn'  then 'GK'
  when 'Hậu vệ'   then 'DF'
  when 'Tiền vệ'  then 'MF'
  when 'Tiền đạo' then 'FW'
end
where position_code is null;