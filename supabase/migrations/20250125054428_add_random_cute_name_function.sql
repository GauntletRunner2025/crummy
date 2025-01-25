-- Create function to get a random untaken cute name
create or replace function get_random_untaken_cute_name()
returns table (name text)
language sql
as $$
  select name 
  from cute_names 
  where taken = false 
  order by random() 
  limit 1;
$$;
