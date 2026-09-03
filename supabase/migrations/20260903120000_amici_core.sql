create schema if not exists private;

create type public.app_role as enum ('citizen', 'advocate', 'staff');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'citizen',
  full_name text,
  phone text,
  lang text not null default 'en',
  created_at timestamptz not null default now()
);

create table public.advocates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles (id) on delete set null,
  slug text unique not null,
  display_name text not null,
  firm text not null,
  town text not null,
  bio text not null,
  fee_from text not null,
  timeline text,
  languages text[] not null default '{}',
  areas text[] not null default '{}',
  lsk_verified boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.consult_requests (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references public.profiles (id) on delete cascade,
  advocate_id uuid not null references public.advocates (id) on delete cascade,
  matter text not null,
  budget text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.escrow_intents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.consult_requests (id) on delete set null,
  citizen_id uuid not null references public.profiles (id) on delete cascade,
  advocate_id uuid not null references public.advocates (id) on delete cascade,
  amount_kes integer not null check (amount_kes > 0),
  mpesa_ref text,
  status text not null default 'held',
  created_at timestamptz not null default now()
);

create table public.case_watches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  case_number text not null,
  title text,
  court text,
  status_note text,
  created_at timestamptz not null default now(),
  unique (user_id, case_number)
);

create table public.integrity_gaps (
  id uuid primary key default gen_random_uuid(),
  case_number text not null,
  court text not null,
  delivered_on date not null,
  uploaded_on date,
  created_at timestamptz not null default now()
);

create table public.integrity_flags (
  id uuid primary key default gen_random_uuid(),
  gap_id uuid not null references public.integrity_gaps (id) on delete cascade,
  flagged_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (gap_id, flagged_by)
);

create table public.rights_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  author text not null check (author in ('user', 'amici')),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.review_items (
  id uuid primary key default gen_random_uuid(),
  advocate_id uuid not null references public.advocates (id) on delete cascade,
  client_label text not null,
  doc_type text not null,
  risk_note text not null,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create index advocates_published_town_idx on public.advocates (town) where published = true;
create index consult_requests_advocate_idx on public.consult_requests (advocate_id, created_at desc);
create index integrity_gaps_case_idx on public.integrity_gaps (case_number);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.advocates enable row level security;
alter table public.consult_requests enable row level security;
alter table public.escrow_intents enable row level security;
alter table public.case_watches enable row level security;
alter table public.integrity_gaps enable row level security;
alter table public.integrity_flags enable row level security;
alter table public.rights_messages enable row level security;
alter table public.review_items enable row level security;

create policy "own profile read"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "own profile update"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));

create policy "published advocates are public"
  on public.advocates for select to anon, authenticated
  using (published = true);

create policy "advocate reads own listing"
  on public.advocates for select to authenticated
  using (profile_id = auth.uid());

create policy "citizen inserts consult"
  on public.consult_requests for insert to authenticated
  with check (citizen_id = auth.uid());

create policy "consult parties read"
  on public.consult_requests for select to authenticated
  using (
    citizen_id = auth.uid()
    or advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid())
  );

create policy "citizen inserts escrow"
  on public.escrow_intents for insert to authenticated
  with check (citizen_id = auth.uid());

create policy "escrow parties read"
  on public.escrow_intents for select to authenticated
  using (
    citizen_id = auth.uid()
    or advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid())
  );

create policy "own case watches"
  on public.case_watches for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "integrity gaps public read"
  on public.integrity_gaps for select to anon, authenticated
  using (true);

create policy "signed-in users flag delays"
  on public.integrity_flags for insert to authenticated
  with check (flagged_by = auth.uid());

create policy "own flags readable"
  on public.integrity_flags for select to authenticated
  using (flagged_by = auth.uid());

create policy "own rights thread"
  on public.rights_messages for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "advocate review queue"
  on public.review_items for select to authenticated
  using (advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid()));

insert into public.advocates (slug, display_name, firm, town, bio, fee_from, timeline, languages, areas, lsk_verified, published)
values
  (
    'wambui',
    'Wambui Njoroge',
    'Njoroge & Gathoni Advocates',
    'Nairobi',
    'Takes SME and tenant matters that larger firms turn away. Consults on WhatsApp after you book here.',
    'KSh 4,500 consult',
    'First reply same day',
    array['English', 'Kiswahili', 'Kikuyu'],
    array['Small claims', 'Employment', 'Contracts'],
    true,
    true
  ),
  (
    'otieno',
    'Peter Otieno',
    'Otieno Legal',
    'Kisumu',
    'Works with clients who cannot travel to Nairobi. Will meet at the High Court registry or by video.',
    'KSh 6,000 consult',
    'Hearing prep in 5–8 days',
    array['English', 'Kiswahili', 'Dholuo'],
    array['Land', 'Succession', 'Family'],
    true,
    true
  ),
  (
    'hassan',
    'Amina Hassan',
    'Hassan Chambers',
    'Mombasa',
    'Keeps a paper release-order pack for days the Case Tracking System is down.',
    'KSh 3,000 consult',
    'Bail papers same afternoon if CTS is up',
    array['English', 'Kiswahili'],
    array['Criminal bail', 'GBV', 'Children'],
    true,
    true
  );

insert into public.integrity_gaps (case_number, court, delivered_on, uploaded_on)
values
  ('HCCC/1234/2023', 'Milimani Civil', '2026-08-28', null),
  ('ELRC/88/2025', 'Nairobi ELRC', '2026-08-12', '2026-09-02'),
  ('CR/2201/2026', 'Makadara', '2026-09-01', '2026-09-01'),
  ('SUCC/19/2024', 'Kisumu High Court', '2026-07-20', null);
