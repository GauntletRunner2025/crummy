-- Create actions table
create table public.actions (
    id uuid default gen_random_uuid() primary key,
    task_type_id text not null references public.task_types(id),
    name text not null,
    description text,
    action_data jsonb not null default '{}'::jsonb
);

-- Add RLS
alter table public.actions enable row level security;

-- Allow all authenticated users to read actions
create policy "Anyone can view actions"
on public.actions for select
to authenticated
using (true);

-- Insert initial actions for SetDisplayName task type
insert into public.actions (task_type_id, name, description, action_data) values
    ('SetDisplayName', 'Update Display Name', 'Updates the user''s display name in their profile', 
    '{"operation": "update_profile", "field": "display_name"}'::jsonb),
    ('SetDisplayName', 'Mark Complete', 'Marks the display name setup as complete', 
    '{"operation": "complete_task"}'::jsonb);

-- Insert default actions
insert into public.actions (task_type_id, name, description, action_data) values
    ('Default', 'Complete Task', 'Marks the task as complete', 
    '{"operation": "complete_task"}'::jsonb);