alter table public.review_items
  add column if not exists body text;

create policy "advocate inserts review"
  on public.review_items for insert to authenticated
  with check (advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid()));

create policy "advocate updates review"
  on public.review_items for update to authenticated
  using (advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid()))
  with check (advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid()));

create or replace function private.protect_advocate_trust()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.lsk_verified := false;
    new.published := false;
  elsif tg_op = 'UPDATE' then
    new.lsk_verified := old.lsk_verified;
    if not old.lsk_verified then
      new.published := false;
    end if;
  end if;
  return new;
end;
$$;

create or replace function private.stamp_advocate(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff'
  ) then
    raise exception 'only staff may stamp LSK';
  end if;
  update public.advocates
    set lsk_verified = true, published = true
    where id = target;
end;
$$;

revoke all on function private.stamp_advocate(uuid) from public;

create or replace function public.stamp_advocate(target uuid)
returns void
language plpgsql
as $$
begin
  perform private.stamp_advocate(target);
end;
$$;

revoke all on function public.stamp_advocate(uuid) from public;
grant execute on function public.stamp_advocate(uuid) to authenticated;
