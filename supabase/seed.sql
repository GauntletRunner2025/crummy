-- Create onboarding entry for a new hire
insert into public.onboarding (
    id,
    email,
    status
) values (
    '00000000-0000-4000-b000-000000000001',  -- Use a deterministic UUID for seeding
    'tom.andrys@gauntletai.com',
    'pending'
) on conflict (email) do nothing;