-- ============================================================
--  002 — SAMPLE REFERENCE DATA
--  National teams, trophies, awards seed data for Vietnamese
--  football context. Safe to re-run (uses ON CONFLICT where applicable).
-- ============================================================

INSERT INTO public.national_teams (name, slug, short_name, country) VALUES
  ('Việt Nam',       'viet-nam',        'VN',  'Việt Nam'),
  ('Thái Lan',       'thai-lan',        'THA', 'Thái Lan'),
  ('Indonesia',      'indonesia',       'IDN', 'Indonesia'),
  ('Malaysia',       'malaysia',        'MAS', 'Malaysia'),
  ('Philippines',    'philippines',     'PHI', 'Philippines'),
  ('Singapore',      'singapore',       'SGP', 'Singapore'),
  ('Myanmar',        'myanmar',         'MYA', 'Myanmar'),
  ('Campuchia',      'campuchia',       'CAM', 'Campuchia'),
  ('Lào',            'lao',             'LAO', 'Lào'),
  ('Timor-Leste',    'timor-leste',     'TLS', 'Timor-Leste')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.trophies (name, short_name, level, description) VALUES
  ('AFF Championship',             'AFF Cup',      'continental',    'Giải vô địch bóng đá Đông Nam Á'),
  ('AFC Asian Cup',                'Asian Cup',    'continental',    'Giải vô địch bóng đá châu Á'),
  ('FIFA World Cup',               'World Cup',    'world',          'Giải vô địch bóng đá thế giới'),
  ('V.League 1',                   'V.League 1',   'domestic_league','Giải vô địch bóng đá quốc gia Việt Nam'),
  ('Cúp Quốc Gia Việt Nam',        'Cúp QG',       'domestic_cup',   'Giải cúp bóng đá quốc gia Việt Nam'),
  ('Siêu Cúp Quốc Gia',            'Siêu Cúp',     'domestic_cup',   'Siêu cúp bóng đá quốc gia Việt Nam'),
  ('AFC Champions League',         'ACL',          'continental',    'Giải vô địch bóng đá các câu lạc bộ châu Á'),
  ('AFC Cup',                      'AFC Cup',      'continental',    'Cúp bóng đá các câu lạc bộ châu Á'),
  ('SEA Games Football',           'SEA Games',    'continental',    'Bóng đá nam Đông Nam Á tại SEA Games'),
  ('Giải hạng Nhất Quốc Gia',      'Hạng Nhất',    'domestic_league','Giải bóng đá hạng nhất Việt Nam');

INSERT INTO public.awards (name, short_name, scope, description) VALUES
  ('Quả Bóng Vàng Việt Nam',       'QBV',          'national',   'Giải thưởng cầu thủ xuất sắc nhất năm của bóng đá Việt Nam'),
  ('Quả Bóng Bạc Việt Nam',        'QBB',          'national',   'Giải thưởng cầu thủ xuất sắc thứ hai của bóng đá Việt Nam'),
  ('Quả Bóng Đồng Việt Nam',       'QBĐ',          'national',   'Giải thưởng cầu thủ xuất sắc thứ ba của bóng đá Việt Nam'),
  ('Vua Phá Lưới V.League',        'VPL',          'national',   'Danh hiệu cầu thủ ghi nhiều bàn thắng nhất V.League'),
  ('Cầu Thủ Xuất Sắc AFF',         'AFF MVP',      'continental','Cầu thủ xuất sắc nhất giải AFF Championship'),
  ('Vua Phá Lưới AFF',             'AFF Top',      'continental','Cầu thủ ghi nhiều bàn thắng nhất AFF Championship'),
  ('Cầu Thủ Trẻ Xuất Sắc V.League','Trẻ XS',       'national',   'Cầu thủ trẻ xuất sắc nhất mùa giải V.League'),
  ('Thủ Môn Xuất Sắc V.League',    'TM XS',        'national',   'Thủ môn xuất sắc nhất mùa giải V.League'),
  ('FIFA Ballon d''Or',            'Ballon d''Or', 'world',      'Giải thưởng cầu thủ xuất sắc nhất thế giới'),
  ('AFC Player of the Year',       'AFC POY',      'continental','Cầu thủ xuất sắc nhất châu Á trong năm');