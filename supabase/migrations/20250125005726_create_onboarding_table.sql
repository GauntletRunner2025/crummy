-- Create onboarding table
create table public.onboarding (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null,
    role text not null,
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.onboarding enable row level security;

-- Create policies
create policy "Users can view their own onboarding records"
on public.onboarding for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own onboarding records"
on public.onboarding for insert
to authenticated
with check (auth.uid() = user_id);

-- Create function to handle new onboarding records
create function public.handle_new_onboarding()
returns trigger as $$
declare
    task_type_id uuid;
begin
    -- Get the onboarding task type ID
    select id into task_type_id
    from public.task_types
    where name = 'Onboarding'
    limit 1;

    -- If onboarding task type doesn't exist, create it
    if task_type_id is null then
        insert into public.task_types (name, description)
        values ('Onboarding', 'New user onboarding process')
        returning id into task_type_id;
    end if;

    -- Create the onboarding task
    insert into public.tasks (
        title,
        description,
        type_id,
        status,
        priority
    ) values (
        'Onboard ' || (select display_name from public.profiles where id = new.user_id),
        'Complete onboarding process for new ' || new.role,
        task_type_id,
        'pending',
        'high'
    );

    return new;
end;
$$ language plpgsql security definer;

-- Create trigger
create trigger on_onboarding_created
    after insert on public.onboarding
    for each row execute procedure public.handle_new_onboarding();