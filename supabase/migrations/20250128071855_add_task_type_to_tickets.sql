-- Add task_type column to tickets table
alter table public.tickets 
add column if not exists task_type text;

-- Add policy to allow the edge function to update task_type
create policy "Edge function can update task_type"
on public.tickets
for update
using (true)
with check (true);
