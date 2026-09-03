drop policy if exists "own profile update" on public.profiles;

create policy "own profile update"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and (
      role = (select p.role from public.profiles p where p.id = auth.uid())
      or (
        (select p.role from public.profiles p where p.id = auth.uid()) = 'citizen'
        and role in ('citizen', 'advocate')
      )
    )
  );

create policy "advocate inserts own listing"
  on public.advocates for insert to authenticated
  with check (
    profile_id = auth.uid()
    and lsk_verified = false
    and published = false
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'advocate')
  );

create policy "advocate updates own listing"
  on public.advocates for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create or replace function private.protect_advocate_trust()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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

revoke all on function private.protect_advocate_trust() from public;

drop trigger if exists protect_advocate_trust on public.advocates;
create trigger protect_advocate_trust
  before insert or update on public.advocates
  for each row execute function private.protect_advocate_trust();

create policy "advocate updates consult status"
  on public.consult_requests for update to authenticated
  using (advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid()))
  with check (advocate_id in (select a.id from public.advocates a where a.profile_id = auth.uid()));
