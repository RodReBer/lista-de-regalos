-- Create reservations table
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.gift_items(id) on delete cascade,
  reserver_name text not null,
  reserver_email text,
  quantity integer not null default 1,
  message text,
  created_at timestamptz default now(),
  constraint valid_reservation_quantity check (quantity > 0)
);

alter table public.reservations enable row level security;

-- RLS policies for reservations
create policy "reservations_select_all"
  on public.reservations for select
  using (true);

create policy "reservations_insert_all"
  on public.reservations for insert
  with check (true);

-- Function to update reserved_count when reservation is created
create or replace function public.update_reserved_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.gift_items
    set reserved_count = reserved_count + NEW.quantity
    where id = NEW.item_id;
  elsif TG_OP = 'DELETE' then
    update public.gift_items
    set reserved_count = reserved_count - OLD.quantity
    where id = OLD.item_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists update_reserved_count_trigger on public.reservations;

create trigger update_reserved_count_trigger
  after insert or delete on public.reservations
  for each row
  execute function public.update_reserved_count();

-- Create index for item lookups
create index if not exists reservations_item_id_idx on public.reservations(item_id);
