-- Create profiles table
create table public.profiles (
    id uuid primary key references auth.users(id),
    display_name text,
    avatar_url text
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view all profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id);

-- Create a trigger to create a profile when a new user signs up
create function public.handle_new_user_profile()
returns trigger as $$
begin
    insert into public.profiles (id)
    values (new.id);
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_profile
    after insert on auth.users
    for each row execute procedure public.handle_new_user_profile();