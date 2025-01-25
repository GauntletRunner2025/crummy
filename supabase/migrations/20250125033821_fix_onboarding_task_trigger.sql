-- Drop existing trigger and function
drop trigger if exists on_new_onboarding on public.onboarding;
drop function if exists handle_new_onboarding();

-- Create updated function to create onboarding task
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
        NEW.id  -- Set target_id to the onboarding record id
    );
    return new;
end;
$$;

-- Create trigger for new onboarding entries
create trigger on_new_onboarding
    after insert on public.onboarding
    for each row
    execute function handle_new_onboarding();
