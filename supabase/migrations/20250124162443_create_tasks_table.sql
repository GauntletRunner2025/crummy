create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    assigned_to uuid references auth.users(id)
);

alter table public.tasks enable row level security;

create policy "Users can view their assigned tasks"
on public.tasks for select
using (auth.uid() = assigned_to);

-- Enable realtime
alter publication supabase_realtime add table public.tasks;
