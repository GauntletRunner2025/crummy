-- Create the roles table
create table public.roles (
    id uuid references auth.users not null primary key,
    role user_role not null default 'Default',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone generated always as (timezone('utc'::text, now())) stored
);
