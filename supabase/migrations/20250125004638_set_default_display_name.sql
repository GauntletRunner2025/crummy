-- Drop the old trigger and function
drop trigger if exists on_auth_user_created_profile on auth.users;
drop function if exists public.handle_new_user_profile();

-- Create the updated function
create function public.handle_new_user_profile()
returns trigger as $$
begin
    insert into public.profiles (id, display_name)
    values (new.id, new.email);
    return new;
end;
$$ language plpgsql security definer;

-- Create the trigger with the updated function
create trigger on_auth_user_created_profile
    after insert on auth.users
    for each row execute procedure public.handle_new_user_profile();

-- Update existing profiles that have null display_name
update public.profiles p
set display_name = u.email
from auth.users u
where p.id = u.id
and p.display_name is null;