-- Enable the necessary extensions
create extension if not exists "uuid-ossp";

-- Create user_profiles table
create table if not exists public.user_profiles (
  id uuid references auth.users(id) primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create quiz_results table
create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  quiz_type text not null,
  score integer not null,
  total_questions integer not null,
  answers jsonb,
  completed_at timestamp with time zone default now()
);

-- Create learning_progress table
create table if not exists public.learning_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  material_slug text not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  unique(user_id, material_slug)
);

-- Create saved_circuits table
create table if not exists public.saved_circuits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  nodes jsonb not null,
  edges jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.quiz_results enable row level security;
alter table public.learning_progress enable row level security;
alter table public.saved_circuits enable row level security;

-- Create policies
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = id);

create policy "Users can view own quiz results" on public.quiz_results
  for select using (auth.uid() = user_id);

create policy "Users can insert own quiz results" on public.quiz_results
  for insert with check (auth.uid() = user_id);

create policy "Users can view own learning progress" on public.learning_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own learning progress" on public.learning_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own learning progress" on public.learning_progress
  for update using (auth.uid() = user_id);

create policy "Users can view own saved circuits" on public.saved_circuits
  for select using (auth.uid() = user_id);

create policy "Users can insert own saved circuits" on public.saved_circuits
  for insert with check (auth.uid() = user_id);

create policy "Users can update own saved circuits" on public.saved_circuits
  for update using (auth.uid() = user_id);

create policy "Users can delete own saved circuits" on public.saved_circuits
  for delete using (auth.uid() = user_id);
