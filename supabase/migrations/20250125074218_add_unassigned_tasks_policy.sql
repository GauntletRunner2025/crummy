-- Add policy to allow viewing unassigned tasks
create policy "Users can view unassigned tasks"
on public.tasks for select
using (assigned_to is null);

-- Drop the old policy that's too restrictive
drop policy if exists "Users can view their assigned tasks" on public.tasks;

-- Create a new combined policy for viewing tasks
create policy "Users can view assigned and unassigned tasks"
on public.tasks for select
using (
    assigned_to is null  -- unassigned tasks
    or auth.uid() = assigned_to  -- assigned to current user
);
