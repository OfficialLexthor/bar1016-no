-- =============================================================================
-- Bar 1016 - Initial Database Schema
-- Migration: 20240101000000_initial_schema.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Trigger: auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Trigger: auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Admins have full access to profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. MENU CATEGORIES
-- ---------------------------------------------------------------------------
create table public.menu_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  sort_order integer not null default 0,
  neon_color text not null default 'cyan',
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_categories enable row level security;

create trigger menu_categories_updated_at
  before update on public.menu_categories
  for each row
  execute function public.handle_updated_at();

-- Public can read active categories
create policy "Anyone can view active menu categories"
  on public.menu_categories for select
  to anon, authenticated
  using (is_active = true);

-- Admins have full CRUD
create policy "Admins have full access to menu categories"
  on public.menu_categories for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. MENU ITEMS
-- ---------------------------------------------------------------------------
create table public.menu_items (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name        text not null,
  description text,
  price       numeric(10, 2) not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.menu_items enable row level security;

create trigger menu_items_updated_at
  before update on public.menu_items
  for each row
  execute function public.handle_updated_at();

-- Public can read active items
create policy "Anyone can view active menu items"
  on public.menu_items for select
  to anon, authenticated
  using (is_active = true);

-- Admins have full CRUD
create policy "Admins have full access to menu items"
  on public.menu_items for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. EVENTS
-- ---------------------------------------------------------------------------
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  event_date   date not null,
  start_time   time not null,
  end_time     time,
  event_type   text not null check (event_type in ('karaoke', 'dj', 'tema', 'annet')),
  image_url    text,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.events enable row level security;

create trigger events_updated_at
  before update on public.events
  for each row
  execute function public.handle_updated_at();

-- Public can view published events
create policy "Anyone can view published events"
  on public.events for select
  to anon, authenticated
  using (is_published = true);

-- Admins have full CRUD
create policy "Admins have full access to events"
  on public.events for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. RESERVATIONS
-- ---------------------------------------------------------------------------
create table public.reservations (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  phone            text,
  date             date not null,
  time             time not null,
  guests           integer not null,
  reservation_type text not null check (reservation_type in ('bord', 'karaoke')),
  message          text,
  status           text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  admin_notes      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.reservations enable row level security;

create trigger reservations_updated_at
  before update on public.reservations
  for each row
  execute function public.handle_updated_at();

-- Anyone can create a reservation (public form)
create policy "Anyone can create a reservation"
  on public.reservations for insert
  to anon, authenticated
  with check (true);

-- Admins have full CRUD
create policy "Admins have full access to reservations"
  on public.reservations for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. GALLERY IMAGES
-- ---------------------------------------------------------------------------
create table public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  alt        text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

-- Public can view gallery
create policy "Anyone can view gallery images"
  on public.gallery_images for select
  to anon, authenticated
  using (true);

-- Admins have full CRUD
create policy "Admins have full access to gallery images"
  on public.gallery_images for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. OPENING HOURS
-- ---------------------------------------------------------------------------
create table public.opening_hours (
  id           uuid primary key default gen_random_uuid(),
  day_of_week  integer unique not null check (day_of_week >= 0 and day_of_week <= 6),
  day_name     text not null,
  is_open      boolean not null default false,
  open_time    time,
  close_time   time
);

alter table public.opening_hours enable row level security;

-- Public can view opening hours
create policy "Anyone can view opening hours"
  on public.opening_hours for select
  to anon, authenticated
  using (true);

-- Admins have full CRUD
create policy "Admins have full access to opening hours"
  on public.opening_hours for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 8. CAMPAIGNS
-- ---------------------------------------------------------------------------
create table public.campaigns (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text,
  start_date  date,
  end_date    date,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.campaigns enable row level security;

create trigger campaigns_updated_at
  before update on public.campaigns
  for each row
  execute function public.handle_updated_at();

-- Public can view active campaigns within date range
create policy "Anyone can view active campaigns in date range"
  on public.campaigns for select
  to anon, authenticated
  using (
    is_active = true
    and (start_date is null or start_date <= current_date)
    and (end_date is null or end_date >= current_date)
  );

-- Admins have full CRUD
create policy "Admins have full access to campaigns"
  on public.campaigns for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 9. CONTACT MESSAGES
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can submit a contact message (public form)
create policy "Anyone can create a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Admins have full CRUD
create policy "Admins have full access to contact messages"
  on public.contact_messages for all
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 10. ENABLE REALTIME
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.menu_items;
alter publication supabase_realtime add table public.menu_categories;

-- ---------------------------------------------------------------------------
-- 11. STORAGE BUCKETS
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('events', 'events', true),
  ('gallery', 'gallery', true),
  ('campaigns', 'campaigns', true)
on conflict (id) do nothing;

-- Public read access for all buckets
create policy "Public read access for events bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'events');

create policy "Public read access for gallery bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

create policy "Public read access for campaigns bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'campaigns');

-- Admin upload/update/delete for all buckets
create policy "Admins can upload to events bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'events' and public.is_admin());

create policy "Admins can update events bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'events' and public.is_admin());

create policy "Admins can delete from events bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'events' and public.is_admin());

create policy "Admins can upload to gallery bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "Admins can update gallery bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin());

create policy "Admins can delete from gallery bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin());

create policy "Admins can upload to campaigns bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'campaigns' and public.is_admin());

create policy "Admins can update campaigns bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'campaigns' and public.is_admin());

create policy "Admins can delete from campaigns bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'campaigns' and public.is_admin());

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Opening Hours (0=Sunday, 1=Monday, ..., 6=Saturday)
-- Mon-Wed closed, Thu/Fri/Sat 18:00-03:00, Sun closed
-- ---------------------------------------------------------------------------
insert into public.opening_hours (day_of_week, day_name, is_open, open_time, close_time) values
  (0, 'Søndag',   false, null,    null),
  (1, 'Mandag',   false, null,    null),
  (2, 'Tirsdag',  false, null,    null),
  (3, 'Onsdag',   false, null,    null),
  (4, 'Torsdag',  true,  '18:00', '03:00'),
  (5, 'Fredag',   true,  '18:00', '03:00'),
  (6, 'Lørdag',   true,  '18:00', '03:00');

-- ---------------------------------------------------------------------------
-- Menu Categories
-- ---------------------------------------------------------------------------
insert into public.menu_categories (id, name, slug, sort_order, neon_color) values
  ('a0000000-0000-0000-0000-000000000001', 'Signatur Cocktails',  'signatur-cocktails',  1,  'cyan'),
  ('a0000000-0000-0000-0000-000000000002', 'Klassiske Cocktails', 'klassiske-cocktails', 2,  'pink'),
  ('a0000000-0000-0000-0000-000000000003', 'Øl',                  'ol',                  3,  'green'),
  ('a0000000-0000-0000-0000-000000000004', 'Flaskeøl',            'flaskeol',            4,  'orange'),
  ('a0000000-0000-0000-0000-000000000005', 'Cider/Rusbrus',       'cider-rusbrus',       5,  'red'),
  ('a0000000-0000-0000-0000-000000000006', 'Whiskey',             'whiskey',             6,  'gold'),
  ('a0000000-0000-0000-0000-000000000007', 'Husets Vin',          'husets-vin',          7,  'purple'),
  ('a0000000-0000-0000-0000-000000000008', 'Shots',               'shots',               8,  'orange'),
  ('a0000000-0000-0000-0000-000000000009', 'Kaffe',               'kaffe',               9,  'green'),
  ('a0000000-0000-0000-0000-000000000010', 'Øvrig',               'ovrig',               10, 'cyan');

-- ---------------------------------------------------------------------------
-- Menu Items
-- ---------------------------------------------------------------------------

-- Signatur Cocktails (169,-)
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000001', 'Strawberry Daiquiri', 'Bacardi Carta Blanca, Sukker, Jordbær, Lime',                          169.00, 1),
  ('a0000000-0000-0000-0000-000000000001', 'Mojito',              'Bacardi Carta Blanca, Sukker, Lime, Mynte',                             169.00, 2),
  ('a0000000-0000-0000-0000-000000000001', 'Mango Daiquiri',      'Bacardi Carta Blanca, Sukker, Mango, Lime',                             169.00, 3),
  ('a0000000-0000-0000-0000-000000000001', 'Long Island Ice Tea',  'Gin, Vodka, Rom, Tequila, Tripplesec, Sourmix, Cola, Lime',            169.00, 4),
  ('a0000000-0000-0000-0000-000000000001', 'Hugo Spritz',         'St-Germain Hylleblomstlikør, Prosecco, Soda, Sitron, Mynte',            169.00, 5),
  ('a0000000-0000-0000-0000-000000000001', 'Aperol Spritz',       'Aperol, Prosecco, Soda Appelsin',                                       169.00, 6);

-- Klassiske Cocktails (159,-)
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000002', 'Whiskey Sour',    'Whiskey, Sitronjuice, Sukkerlake, Eggehvite, Angostura Bitter',            159.00, 1),
  ('a0000000-0000-0000-0000-000000000002', 'Sure Føtter',     'Eristoff Vodka, Jägermeister, Midori, Cola, Sourmix, Peach',               159.00, 2),
  ('a0000000-0000-0000-0000-000000000002', 'Snowball',        'Eristoff Vodka, Eggelikør, Sprite, Lime',                                  159.00, 3),
  ('a0000000-0000-0000-0000-000000000002', 'Pink Russian',    'Pink Gin, Russian, Lime',                                                  159.00, 4),
  ('a0000000-0000-0000-0000-000000000002', 'Moscow Mule',     'Barcardi Vodka, Ingefærøl, Lime',                                          159.00, 5),
  ('a0000000-0000-0000-0000-000000000002', 'Mie''s',          'Bacardi Razz, Peachtree, Sourmix, Lime, Sprite',                            159.00, 6),
  ('a0000000-0000-0000-0000-000000000002', 'Lennart',         'Eristoff Vodka, Xante, Sprite, Lime',                                      159.00, 7),
  ('a0000000-0000-0000-0000-000000000002', 'Dark & Stormy',   'Bacardi Spiced, Ingefærøl, Lime',                                          159.00, 8),
  ('a0000000-0000-0000-0000-000000000002', 'Clover Club',     'Bombay Sapphire Gin, Bringebærsirup, Sitronjuice, Eggehvite',               159.00, 9),
  ('a0000000-0000-0000-0000-000000000002', 'Amaretto Sour',   'Amaretto, Sitronjuice, Sukkerlake, Eggehvite, Angostura Bitter',            159.00, 10),
  ('a0000000-0000-0000-0000-000000000002', 'Aloe Vera',       'Bacardi Lemon, Melonlikør, Sourmix, Lime',                                  159.00, 11);

-- Øl
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000003', 'Mango IPA 0,4', null, 139.00, 1),
  ('a0000000-0000-0000-0000-000000000003', 'Borg 0,5',      null, 118.00, 2),
  ('a0000000-0000-0000-0000-000000000003', 'Borg 0,4',      null,  98.00, 3),
  ('a0000000-0000-0000-0000-000000000003', 'Borg 0,3',      null,  76.00, 4);

-- Flaskeøl
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000004', 'Sol',          null,  97.00, 1),
  ('a0000000-0000-0000-0000-000000000004', 'Nøgne Ø IPA', null, 109.00, 2),
  ('a0000000-0000-0000-0000-000000000004', 'Heineken',     null, 119.00, 3),
  ('a0000000-0000-0000-0000-000000000004', 'Borg Lite',    null, 119.00, 4);

-- Cider/Rusbrus
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000005', 'Smirnoff Ice',   null,  97.00, 1),
  ('a0000000-0000-0000-0000-000000000005', 'Grevens Pære',   null, 109.00, 2),
  ('a0000000-0000-0000-0000-000000000005', 'Ginger Joe',     null,  97.00, 3),
  ('a0000000-0000-0000-0000-000000000005', 'Bulmers',        null, 129.00, 4),
  ('a0000000-0000-0000-0000-000000000005', 'Breezer',        null,  97.00, 5);

-- Whiskey
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000006', 'Teeling Single Malt', null, 139.00, 1),
  ('a0000000-0000-0000-0000-000000000006', 'Jack Daniels',        null, 139.00, 2),
  ('a0000000-0000-0000-0000-000000000006', 'Angels Envy',         null, 149.00, 3);

-- Husets Vin
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000007', 'Prosecco Glass', null, 139.00, 1),
  ('a0000000-0000-0000-0000-000000000007', 'Glass',          null, 139.00, 2),
  ('a0000000-0000-0000-0000-000000000007', 'Flaske',         null, 599.00, 3);

-- Shots
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000008', 'Patrón Silver Tequila', null, 129.00, 1),
  ('a0000000-0000-0000-0000-000000000008', 'Over 20%',              null, 119.00, 2),
  ('a0000000-0000-0000-0000-000000000008', 'Under 20%',             null, 109.00, 3);

-- Kaffe
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000009', 'Kaffe m/Baileys', null, 139.00, 1),
  ('a0000000-0000-0000-0000-000000000009', 'Irish Coffee',    null, 159.00, 2),
  ('a0000000-0000-0000-0000-000000000009', 'Kaffe',           null,  50.00, 3);

-- Øvrig
insert into public.menu_items (category_id, name, description, price, sort_order) values
  ('a0000000-0000-0000-0000-000000000010', 'Otard',                   'Cognac',       139.00, 1),
  ('a0000000-0000-0000-0000-000000000010', 'Brastad',                 'Cognac',       139.00, 2),
  ('a0000000-0000-0000-0000-000000000010', 'Heineken (alkoholfri)',   null,            55.00, 3),
  ('a0000000-0000-0000-0000-000000000010', 'Brus',                    null,            50.00, 4);
