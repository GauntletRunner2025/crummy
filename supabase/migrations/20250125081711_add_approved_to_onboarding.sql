-- Add approved column to onboarding table
alter table public.onboarding add column approved boolean not null default false;

-- Update policy to allow updating approved status
create policy "Allow updating approved status"
on public.onboarding for update
to authenticated
using (true)
with check (true);
