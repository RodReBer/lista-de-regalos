-- Create gift_items table
create table if not exists public.gift_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.gift_lists(id) on delete cascade,
  name text not null,
  description text,
  link text,
  image_url text,
  quantity integer not null default 1,
  reserved_count integer not null default 0,
  priority integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_quantity check (quantity > 0),
  constraint valid_reserved check (reserved_count >= 0 and reserved_count <= quantity)
);

alter table public.gift_items enable row level security;

-- RLS policies for gift_items
create policy "gift_items_select_all"
  on public.gift_items for select
  using (true);

create policy "gift_items_insert_own_list"
  on public.gift_items for insert
  with check (
    exists (
      select 1 from public.gift_lists
      where id = list_id and user_id = auth.uid()
    )
  );

create policy "gift_items_update_own_list"
  on public.gift_items for update
  using (
    exists (
      select 1 from public.gift_lists
      where id = list_id and user_id = auth.uid()
    )
  );

create policy "gift_items_delete_own_list"
  on public.gift_items for delete
  using (
    exists (
      select 1 from public.gift_lists
      where id = list_id and user_id = auth.uid()
    )
  );

-- Create index for list lookups
create index if not exists gift_items_list_id_idx on public.gift_items(list_id);
