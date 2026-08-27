create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  category text not null check (category in ('상의', '하의', '아우터', '신발')),
  subcategory text,
  color text,
  color_hex text,
  emoji text,
  image_url text,
  source text not null default 'manual' check (source in ('gmail', 'capture', 'manual')),
  source_ref text,
  detail text,
  attributes jsonb not null default '{}'::jsonb,
  confidence numeric(4, 3) check (confidence between 0 and 1),
  needs_review boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('gmail', 'capture')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  source_ref text,
  found_count integer not null default 0 check (found_count >= 0),
  imported_count integer not null default 0 check (imported_count >= 0),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tpo text not null,
  weather jsonb not null default '{}'::jsonb,
  reason text,
  source text not null default 'rules' check (source in ('rules', 'ai', 'hybrid')),
  created_at timestamptz not null default now()
);

create table public.outfit_items (
  outfit_id uuid not null references public.outfits(id) on delete cascade,
  clothing_item_id uuid not null references public.clothing_items(id) on delete cascade,
  slot text not null check (slot in ('top', 'bottom', 'outer', 'shoes')),
  primary key (outfit_id, clothing_item_id)
);

create table public.wear_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  outfit_id uuid references public.outfits(id) on delete set null,
  worn_on date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create index clothing_items_user_id_idx on public.clothing_items(user_id);
create index clothing_items_user_category_idx on public.clothing_items(user_id, category);
create unique index clothing_items_source_ref_idx
  on public.clothing_items(user_id, source, source_ref)
  where source_ref is not null;
create index imports_user_id_idx on public.imports(user_id);
create index outfits_user_id_idx on public.outfits(user_id);
create index outfit_items_clothing_item_id_idx on public.outfit_items(clothing_item_id);
create index wear_logs_user_id_idx on public.wear_logs(user_id);
create index wear_logs_user_worn_on_idx on public.wear_logs(user_id, worn_on desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger clothing_items_set_updated_at
before update on public.clothing_items
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', '자비스 사용자'));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.clothing_items enable row level security;
alter table public.imports enable row level security;
alter table public.outfits enable row level security;
alter table public.outfit_items enable row level security;
alter table public.wear_logs enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.clothing_items from anon, authenticated;
revoke all on table public.imports from anon, authenticated;
revoke all on table public.outfits from anon, authenticated;
revoke all on table public.outfit_items from anon, authenticated;
revoke all on table public.wear_logs from anon, authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.clothing_items to authenticated;
grant select, insert, update, delete on table public.imports to authenticated;
grant select, insert, update, delete on table public.outfits to authenticated;
grant select, insert, update, delete on table public.outfit_items to authenticated;
grant select, insert, update, delete on table public.wear_logs to authenticated;

create policy "profiles_select_own" on public.profiles
for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles
for delete to authenticated using ((select auth.uid()) = id);

create policy "clothing_items_select_own" on public.clothing_items
for select to authenticated using ((select auth.uid()) = user_id);
create policy "clothing_items_insert_own" on public.clothing_items
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "clothing_items_update_own" on public.clothing_items
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "clothing_items_delete_own" on public.clothing_items
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "imports_select_own" on public.imports
for select to authenticated using ((select auth.uid()) = user_id);
create policy "imports_insert_own" on public.imports
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "imports_update_own" on public.imports
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "imports_delete_own" on public.imports
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "outfits_select_own" on public.outfits
for select to authenticated using ((select auth.uid()) = user_id);
create policy "outfits_insert_own" on public.outfits
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "outfits_update_own" on public.outfits
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "outfits_delete_own" on public.outfits
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "outfit_items_select_own" on public.outfit_items
for select to authenticated using (
  exists (
    select 1 from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = (select auth.uid())
  )
);
create policy "outfit_items_insert_own" on public.outfit_items
for insert to authenticated with check (
  exists (
    select 1 from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = (select auth.uid())
  )
);
create policy "outfit_items_update_own" on public.outfit_items
for update to authenticated
using (
  exists (
    select 1 from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = (select auth.uid())
  )
);
create policy "outfit_items_delete_own" on public.outfit_items
for delete to authenticated using (
  exists (
    select 1 from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = (select auth.uid())
  )
);

create policy "wear_logs_select_own" on public.wear_logs
for select to authenticated using ((select auth.uid()) = user_id);
create policy "wear_logs_insert_own" on public.wear_logs
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "wear_logs_update_own" on public.wear_logs
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "wear_logs_delete_own" on public.wear_logs
for delete to authenticated using ((select auth.uid()) = user_id);

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
