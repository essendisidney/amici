alter table public.escrow_intents
  add column if not exists phone text,
  add column if not exists purpose text not null default 'consult',
  add column if not exists checkout_request_id text,
  add column if not exists released_at timestamptz;

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid references public.escrow_intents (id) on delete cascade,
  result_code integer,
  created_at timestamptz not null default now()
);

alter table public.payment_events enable row level security;

create policy "own escrow events"
  on public.payment_events for select to authenticated
  using (
    intent_id in (select e.id from public.escrow_intents e where e.citizen_id = auth.uid())
    or intent_id in (
      select e.id from public.escrow_intents e
      join public.advocates a on a.id = e.advocate_id
      where a.profile_id = auth.uid()
    )
  );
