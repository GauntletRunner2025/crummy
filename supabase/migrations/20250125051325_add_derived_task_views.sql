-- Create derived task views table
create table public.derived_task_views (
    id uuid primary key default gen_random_uuid(),
    task_type_id text not null references public.task_types(id) on delete cascade,
    name text not null,
    component_name text not null,
    is_default boolean not null default false,
    description text
);

-- Add unique constraint to ensure only one default view per task type
create unique index one_default_per_task_type 
    on public.derived_task_views (task_type_id) 
    where is_default = true;

-- Insert derived views for SetDisplayName task type
insert into public.derived_task_views (task_type_id, name, component_name, is_default, description)
values
    ('SetDisplayName', 'Default', 'SetDisplayNameView', true, 'Standard display name setting'),
    ('SetDisplayName', 'Anonymous', 'SetDisplayNameAnonymousView', false, 'Set display name with anonymous prefix'),
    ('SetDisplayName', 'Cutesy', 'SetDisplayNameCutesyView', false, 'Set display name with cute decorations');

-- Enable RLS
alter table public.derived_task_views enable row level security;

-- Anyone can read derived task views
create policy "Anyone can view derived task views"
on public.derived_task_views for select
to authenticated
using (true);
