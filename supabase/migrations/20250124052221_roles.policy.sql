-- Enable RLS on roles table
alter table public.roles enable row level security;

-- Allow users to see their own role
create policy "Users can view their own role"
on public.roles for select
using (auth.uid() = id);

-- Allow only supervisors to update roles
create policy "Only supervisors can update roles"
on public.roles for update
using (
    exists (
        select 1 
        from public.roles 
        where id = auth.uid() 
        and role = 'Supervisor'
    )
);

-- Allow insert only if the user doesn't already have a role
create policy "Users can insert their own role once"
on public.roles for insert
with check (
    auth.uid() = id 
    and not exists (
        select 1 
        from public.roles 
        where id = auth.uid()
    )
);
