-- Create a public bucket for list cover images
insert into storage.buckets (id, name, public)
values ('public-images', 'public-images', true)
on conflict (id) do nothing;

-- Set up storage policies for public-images bucket
create policy "Anyone can view public images"
  on storage.objects for select
  using (bucket_id = 'public-images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'public-images' 
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own images"
  on storage.objects for update
  using (
    bucket_id = 'public-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'public-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );
