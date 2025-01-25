-- Create the task types table
create table public.task_types (
    id text primary key,
    name text not null,
    description text
);

-- Insert the known task types
insert into public.task_types (id, name, description) values
    ('SetDisplayName', 'Set Display Name', 'Task for setting up your display name'),
    ('Default', 'Default Task', 'A standard task with no special behavior');

-- Create the tasks table with a foreign key to task_types
create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    assigned_to uuid references auth.users(id),
    type_id text not null references public.task_types(id) default 'Default'
);

-- Add RLS policies
alter table public.tasks enable row level security;
alter table public.task_types enable row level security;

-- Everyone can read task types
create policy "Anyone can view task types"
on public.task_types for select
to authenticated
using (true);

-- Users can only see their own tasks
create policy "Users can view their assigned tasks"
on public.tasks for select
using (auth.uid() = assigned_to);

-- Enable realtime for tasks
alter publication supabase_realtime add table public.tasks;
