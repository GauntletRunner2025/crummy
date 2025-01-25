-- Add target_id column to tasks table
ALTER TABLE public.tasks
ADD COLUMN target_id uuid REFERENCES public.onboarding(id);

-- Add comment for documentation
COMMENT ON COLUMN public.tasks.target_id IS 'Reference to the onboarding record this task is associated with';
