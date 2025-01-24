create function public.handle_new_user_task()
returns trigger as $$
begin
    insert into public.tasks (assigned_to, title)
    values (new.id, 'Set your Display Name');
    return new;
end;
$$ language plpgsql security definer;
