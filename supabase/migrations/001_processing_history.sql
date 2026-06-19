-- Run this in Supabase Dashboard -> SQL Editor

create table if not exists public.processing_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_url text,
  processed_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists processing_history_user_id_created_at_idx
  on public.processing_history (user_id, created_at desc);

alter table public.processing_history enable row level security;

create policy "Users can read own processing history"
  on public.processing_history
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own processing history"
  on public.processing_history
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own processing history"
  on public.processing_history
  for delete
  using (auth.uid() = user_id);
