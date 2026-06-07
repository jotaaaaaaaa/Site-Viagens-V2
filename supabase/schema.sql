-- Rode este arquivo no SQL Editor do Supabase antes de publicar na Vercel.
-- Ele cria o estado compartilhado do mural e o bucket publico para ler as fotos.

create table if not exists public.trip_state (
  id text primary key,
  favorites jsonb not null default '[]'::jsonb,
  photo_order jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_photos (
  id text primary key,
  trip_id text not null,
  gallery_key text not null check (gallery_key in ('madrid', 'alicante', 'amsterdam')),
  data jsonb not null,
  sort_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists custom_photos_trip_gallery_idx
  on public.custom_photos (trip_id, gallery_key, sort_index, created_at);

alter table public.trip_state enable row level security;
alter table public.custom_photos enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-viagem-fotos',
  'site-viagem-fotos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
