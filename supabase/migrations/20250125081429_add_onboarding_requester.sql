-- Add requested_by_email column to onboarding table
alter table public.onboarding
add column requested_by_email text;
