-- Create onboarding table
create table public.onboarding (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    created_at timestamp with time zone default now(),
    status text not null default 'pending'
);

-- Enable RLS
alter table public.onboarding enable row level security;

-- Allow anyone to view onboarding entries
create policy "Anyone can view onboarding"
on public.onboarding for select
to authenticated
using (true);

-- Create function to create onboarding task
create or replace function handle_new_onboarding()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Create a new task for this onboarding
    insert into public.tasks (title, type_id, assigned_to, status)
    values (
        'New User Onboarding: ' || NEW.email,
        'onboarding',
        null,  -- unassigned
        'Open'
    );
    return new;
end;
$$;

-- Create trigger for new onboarding entries
create trigger on_new_onboarding
    after insert on public.onboarding
    for each row
    execute function handle_new_onboarding();
