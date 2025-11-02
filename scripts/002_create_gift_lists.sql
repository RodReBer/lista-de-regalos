-- Create gift_lists table
create table if not exists public.gift_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_image text,
  theme_color text default '#fbbf24',
  slug text unique not null,
  event_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.gift_lists enable row level security;

-- RLS policies for gift_lists
create policy "gift_lists_select_own"
  on public.gift_lists for select
  using (auth.uid() = user_id);

create policy "gift_lists_select_public"
  on public.gift_lists for select
  using (true);

create policy "gift_lists_insert_own"
  on public.gift_lists for insert
  with check (auth.uid() = user_id);

create policy "gift_lists_update_own"
  on public.gift_lists for update
  using (auth.uid() = user_id);

create policy "gift_lists_delete_own"
  on public.gift_lists for delete
  using (auth.uid() = user_id);

-- Create index for slug lookups
create index if not exists gift_lists_slug_idx on public.gift_lists(slug);
create index if not exists gift_lists_user_id_idx on public.gift_lists(user_id);
