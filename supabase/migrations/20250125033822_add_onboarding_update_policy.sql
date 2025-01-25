-- Drop any existing update policy
drop policy if exists "Allow updating onboarding" on public.onboarding;

-- Create policy to allow updating onboarding entries
create policy "Allow updating onboarding"
on public.onboarding for update
to authenticated
using (true)
with check (true);
