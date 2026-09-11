-- OAK Zimbabwe Partner Gathering 2026 — seed data for programme + daily posts.
-- Idempotent: safe to run more than once (INSERTs skip existing ids).

-- ============================================================
-- PROGRAMME SESSIONS (Harare local time = UTC+2)
-- ============================================================
insert into programme_sessions (id, day_number, day_label, starts_at, ends_at, title, description, location, speaker, sort_order) values
-- Day 1 — Monday 9 March
('a1000000-0000-0000-0000-000000000001', 1, 'MON', '2026-03-09 08:30:00+02', '2026-03-09 09:00:00+02', 'Registration & Welcome Coffee', 'Pick up your badge and entry pass at the main entrance of Hall 1.', 'Hall 1', null, 0),
('a1000000-0000-0000-0000-000000000002', 1, 'MON', '2026-03-09 09:00:00+02', '2026-03-09 10:30:00+02', 'Opening Plenary: The State of Civic Space in 2026', 'A joint opening with the Steering Committee framing the convening themes.', 'Plenary Hall', 'Elias Chikunzwi', 1),
('a1000000-0000-0000-0000-000000000003', 1, 'MON', '2026-03-09 11:00:00+02', '2026-03-09 12:30:00+02', 'Workshop: Long-horizon Philanthropy', 'Interactive workshop on 10-year time horizons for systemic change.', 'Room 2', 'Dr. Amara Diallo', 2),
('a1000000-0000-0000-0000-000000000004', 1, 'MON', '2026-03-09 14:00:00+02', '2026-03-09 15:30:00+02', 'Breakout: Digital Rights Integration', 'How digital rights fold into every programme area, not just ICT.', 'Room 4', 'Naledi Mokoena', 3),
('a1000000-0000-0000-0000-000000000005', 1, 'MON', '2026-03-09 16:00:00+02', '2026-03-09 17:30:00+02', 'Peer Exchange: Grantmaking Best Practice', 'Roundtable peer exchange on grantee advocacy effectiveness.', 'Plenary Hall', 'Facilitators', 4),
('a1000000-0000-0000-0000-000000000006', 1, 'MON', '2026-03-09 19:00:00+02', '2026-03-09 21:00:00+02', 'Welcome Reception', 'Evening reception for all partners at the garden terrace.', 'Terrace', null, 5),

-- Day 2 — Tuesday 10 March (FEATURED)
('b2000000-0000-0000-0000-000000000001', 2, 'FEATURED', '2026-03-10 09:00:00+02', '2026-03-10 10:30:00+02', 'Keynote: Shared Learning Infrastructure', 'How shared infrastructure can multiply impact across the portfolio.', 'Plenary Hall', 'Thandiwe Ncube', 0),
('b2000000-0000-0000-0000-000000000002', 2, 'FEATURED', '2026-03-10 11:00:00+02', '2026-03-10 12:30:00+02', 'Workshop: Advocacy Effectiveness Lab', 'Hands-on session strengthening grantee advocacy.', 'Room 3', 'Omar Farouk', 1),
('b2000000-0000-0000-0000-000000000003', 2, 'FEATURED', '2026-03-10 14:00:00+02', '2026-03-10 15:30:00+02', 'Featured Panel: Climate & Civic Space', 'Cross-portfolio panel on climate justice and civic space.', 'Plenary Hall', 'Zanele Banda', 2),
('b2000000-0000-0000-0000-000000000004', 2, 'FEATURED', '2026-03-10 16:00:00+02', '2026-03-10 17:30:00+02', 'Partner Funder Showcase', 'Short showcase pitches from partner organisations.', 'Room 2', 'Partners', 3),

-- Day 3 — Wednesday 11 March
('c3000000-0000-0000-0000-000000000001', 3, 'WED', '2026-03-11 09:00:00+02', '2026-03-11 10:30:00+02', 'Plenary: Consortium Designs', 'Working through consortium designs for shared infrastructure.', 'Plenary Hall', 'Kofi Mensah', 0),
('c3000000-0000-0000-0000-000000000002', 3, 'WED', '2026-03-11 11:00:00+02', '2026-03-11 12:30:00+02', 'Breakout: M&E Shared Metrics', 'Defining shared measurement approaches.', 'Room 4', 'Lucy van der Merwe', 1),
('c3000000-0000-0000-0000-000000000003', 3, 'WED', '2026-03-11 14:00:00+02', '2026-03-11 15:30:00+02', 'Closing Plenary & Way Forward', 'Commitments and next steps for 2026-2028.', 'Plenary Hall', 'Steering Committee', 2);

-- ============================================================
-- DAILY POSTS (documentation section)
-- ============================================================
insert into daily_posts (id, day_number, day_label, title, body, photo_urls, published_at) values
('d4000000-0000-0000-0000-000000000001', 1, 'Day 1 · MON', 'Opening day highlights', '120+ partners registered. Opening plenary kicked off with a strong call for long-horizon philanthropy and a live poll on shared learning infrastructure.', null, '2026-03-09 18:30:00+02'),
('d4000000-0000-0000-0000-000000000002', 2, 'Day 2 · FEATURED', 'Featured day in review', 'The Advocacy Effectiveness Lab filled Room 3 to capacity. Notes from the Featured Panel on Climate & Civic Space will be shared here shortly.', null, '2026-03-10 18:30:00+02')
on conflict (id) do nothing;