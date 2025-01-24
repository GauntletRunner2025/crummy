-- Create the roles table
create table public.roles (
    id uuid references auth.users not null primary key,
    role user_role not null default 'Default'
);
