-- Create the tickets table
create table if not exists public.tickets (
    id uuid primary key default gen_random_uuid(),
    description text not null,
    body text not null
);

-- Create policy to allow authenticated users to insert tickets
create policy "Users can create tickets"
on public.tickets
for insert
to authenticated
with check (true);

-- Enable RLS
alter table public.tickets enable row level security;

-- Create function to create a task when a ticket is created
create or replace function public.handle_new_ticket()
returns trigger as $$
begin
    insert into public.tasks (name, type)
    values ('Resolve Ticket ' || NEW.description, 'ResolveTicket');
    return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger to create task when ticket is created
create trigger on_ticket_created
    after insert on public.tickets
    for each row
    execute function public.handle_new_ticket();
