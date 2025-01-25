-- Create task status enum
create type task_status as enum ('Open', 'Complete');

-- Add status column to tasks table
alter table public.tasks 
add column status task_status not null default 'Open';

-- Update existing tasks to be Open
update public.tasks set status = 'Open';
