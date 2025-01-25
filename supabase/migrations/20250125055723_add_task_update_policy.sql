-- Allow users to update tasks assigned to them
create policy "Users can update their assigned tasks"
on public.tasks
for update
using (auth.uid() = assigned_to)
with check (auth.uid() = assigned_to);

-- Allow users to update unassigned tasks
create policy "Users can update unassigned tasks"
on public.tasks
for update
using (assigned_to is null)
with check (assigned_to is null);
