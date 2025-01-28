-- Drop the trigger first
drop trigger if exists on_ticket_created on public.tickets;

-- Then drop the function
drop function if exists public.handle_new_ticket();
