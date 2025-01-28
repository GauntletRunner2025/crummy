-- Drop existing roles table
drop table if exists public.roles;

-- Drop the user_role type if it exists
drop type if exists public.user_role;

-- Create RoleTypes table
create table public.role_types (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text
);

-- Create new Roles table with foreign keys to both auth.users and role_types
create table public.roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null,
    role_type_id uuid references public.role_types(id) not null,
    -- Ensure a user can't have the same role type multiple times
    unique(user_id, role_type_id)
);

-- Basic policies for RoleTypes
create policy "RoleTypes are viewable by all authenticated users"
    on public.role_types for select
    to authenticated
    using (true);

-- Basic policies for Roles
create policy "Roles are viewable by all authenticated users"
    on public.roles for select
    to authenticated
    using (true);

-- Only allow authenticated users with specific permissions to modify roles
create policy "Roles can only be modified by authorized users"
    on public.roles for insert
    to authenticated
    with check (auth.uid() in (
        select r.user_id 
        from public.roles r 
        inner join public.role_types rt on r.role_type_id = rt.id 
        where rt.name = 'admin'
    ));

create policy "Roles can only be updated by authorized users"
    on public.roles for update
    to authenticated
    using (auth.uid() in (
        select r.user_id 
        from public.roles r 
        inner join public.role_types rt on r.role_type_id = rt.id 
        where rt.name = 'admin'
    ));

create policy "Roles can only be deleted by authorized users"
    on public.roles for delete
    to authenticated
    using (auth.uid() in (
        select r.user_id 
        from public.roles r 
        inner join public.role_types rt on r.role_type_id = rt.id 
        where rt.name = 'admin'
    ));
