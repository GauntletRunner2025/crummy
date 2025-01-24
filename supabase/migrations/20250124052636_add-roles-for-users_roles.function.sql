-- Insert a trigger to automatically create a role for new users
create function public.handle_new_user()
returns trigger as $$
begin
    insert into public.roles (id, role)
    values (new.id, 'Default');
    return new;
end;
$$ language plpgsql security definer;
