-- OAK Zimbabwe Partner Gathering 2026
-- Database schema for registration, attendance, programme, and partner directory.

-- ============================================================
-- 1. ATTENDEES – one row per registered person
-- ============================================================
create table if not exists attendees (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,          -- public registration ID shown on QR (e.g. OG26-ABCD)
  first_name      text not null,
  last_name       text not null,
  organisation    text not null,
  sub_partner     text,
  role            text not null check (role in
                    ('partner','oak_staff','coordination_team','presenter','observer')),
  email           text not null,
  phone           text,
  dietary         text,
  accessibility   text,
  travel          text,
  accommodation   text,
  consent         boolean not null default false,
  access_token    text unique,                    -- secret token used for token/link auth
  registered_at   timestamptz not null default now()
);

-- fast lookups
create index if not exists idx_attendees_reference on attendees (reference);
create index if not exists idx_attendees_name on attendees (last_name, first_name);
create index if not exists idx_attendees_org on attendees (organisation);
create index if not exists idx_attendees_role on attendees (role);

-- ============================================================
-- 2. CHECK-INS – one row per scan event
-- ============================================================
create table if not exists checkins (
  id            uuid primary key default gen_random_uuid(),
  attendee_id   uuid not null references attendees(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  method        text not null default 'qr_scan'   -- 'qr_scan' | 'manual'
);

create index if not exists idx_checkins_attendee on checkins (attendee_id);
create index if not exists idx_checkins_time on checkins (checked_in_at);

-- ============================================================
-- 3. PROGRAMME SESSIONS – day-by-day schedule
-- ============================================================
create table if not exists programme_sessions (
  id           uuid primary key default gen_random_uuid(),
  day_number   smallint not null,   -- 1, 2, 3
  day_label    text not null,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  title        text not null,
  description  text,
  location     text,
  speaker      text,
  sort_order   smallint not null default 0
);

create index if not exists idx_sessions_day on programme_sessions (day_number, sort_order);

-- ============================================================
-- 4. DAILY POSTS – documentation / notes + photos
-- ============================================================
create table if not exists daily_posts (
  id           uuid primary key default gen_random_uuid(),
  day_number   smallint not null,
  day_label    text not null,
  title        text not null,
  body         text,
  photo_urls   text[],
  published_at timestamptz not null default now()
);

create index if not exists idx_posts_day on daily_posts (day_number);

-- ============================================================
-- 5. PARTNERS – organisations attending
-- ============================================================
create table if not exists partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  short_name    text,
  logo_url      text,
  website_url   text,
  description   text,
  areas_of_work text,
  contact_email text,
  contact_phone text,
  sort_order    smallint not null default 0
);

create index if not exists idx_partners_name on partners (name);

-- ============================================================
-- 6. SESSION NOTES – private per-user notes on a session
-- ============================================================
create table if not exists session_notes (
  id           uuid primary key default gen_random_uuid(),
  attendee_id  uuid not null references attendees(id) on delete cascade,
  session_id   uuid not null references programme_sessions(id) on delete cascade,
  body         text not null default '',
  updated_at   timestamptz not null default now(),
  unique (attendee_id, session_id)
);

create index if not exists idx_notes_attendee on session_notes (attendee_id);

-- ============================================================
-- 7. STORAGE – partner logos + daily photos (optional)
-- ============================================================
-- Run via Supabase dashboard or SQL:
--   insert into storage.buckets (id, name, public) values ('partner-logos', 'partner-logos', true);
--   insert into storage.buckets (id, name, public) values ('daily-photos', 'daily-photos', true);

-- ============================================================
-- Row Level Security
-- ------------------------------------------------------------
-- The app runs queries with the Publishable/anon key from the server
-- (server actions + route handlers). For a student-built event platform we
-- enable public READ on event content, and allow the app's write flows.
-- Harden these for production (e.g. use the service role on the server and
-- tighten to authenticated/owner-only policies).
-- ============================================================
alter table attendees enable row level security;
alter table checkins enable row level security;
alter table session_notes enable row level security;
alter table programme_sessions enable row level security;
alter table daily_posts enable row level security;
alter table partners enable row level security;

-- Public read for event content (programme, partners, daily posts)
create policy "public read programme" on programme_sessions for select using (true);
create policy "public read posts" on daily_posts for select using (true);
create policy "public read partners" on partners for select using (true);

-- Registration inserts + attendee reads come from the server action using the
-- anon key, so allow the server-side writes for now.
create policy "server insert attendees" on attendees for insert with check (true);
create policy "server read attendees" on attendees for select using (true);
create policy "server write checkins" on checkins for insert with check (true);
create policy "server read checkins" on checkins for select using (true);
create policy "server read sessions" on programme_sessions for select using (true);

-- Session notes: the owner (attendee_id from the session) manages their own.
create policy "owner read notes" on session_notes for select using (true);
create policy "owner write notes" on session_notes
  for all using (true) with check (true);

-- ============================================================
-- Table grants for the anon/publishable key (web app uses the
-- anon key from server actions + route handlers). Without these,
-- RLS policies still block non-privileged roles from the tables.
-- ============================================================
grant select on programme_sessions, daily_posts, partners to anon, authenticated;
grant insert, select on attendees to anon, authenticated;
grant insert, select on checkins to anon, authenticated;
grant select, insert, update on session_notes to anon, authenticated;
