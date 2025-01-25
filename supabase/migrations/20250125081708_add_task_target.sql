-- Add target column to tasks table
alter table public.tasks
add column target_id uuid;

-- Update existing onboarding tasks with their target IDs
update public.tasks t
set target_id = o.id
from public.onboarding o
where t.type_id = 'onboarding'
  and t.title like 'New User Onboarding: ' || o.email;

-- Add foreign key constraints based on task type
create or replace function check_task_target()
returns trigger as $$
begin
  case new.type_id
    when 'onboarding' then
      if not exists (select 1 from public.onboarding where id = new.target_id) then
        raise exception 'Invalid target_id for onboarding task';
      end if;
    -- Add more cases here for other task types
    else
      -- For unknown task types, allow null target_id
      if new.target_id is not null then
        raise exception 'Unexpected target_id for task type: %', new.type_id;
      end if;
  end case;
  return new;
end;
$$ language plpgsql;

-- Create trigger to validate target_id based on task type
create trigger check_task_target
  before insert or update on public.tasks
  for each row
  execute function check_task_target();

-- Update the handle_new_onboarding function to include target_id
create or replace function handle_new_onboarding()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Create a new task for this onboarding
    insert into public.tasks (title, type_id, assigned_to, status, target_id)
    values (
        'New User Onboarding: ' || NEW.email,
        'onboarding',
        null,  -- unassigned
        'Open',
        NEW.id  -- Set the target_id to the onboarding record's ID
    );
    return new;
end;
$$;
