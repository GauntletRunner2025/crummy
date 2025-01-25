-- Enable realtime for profiles table
alter publication supabase_realtime add table profiles;

-- Ensure the table has replica identity set to full for realtime to work properly
alter table profiles replica identity full;
