-- First drop the previous tables
DROP TABLE IF EXISTS public.action_options;
DROP TABLE IF EXISTS public.action_templates;
DROP TABLE IF EXISTS public.actions;

-- Recreate just the action_templates table
CREATE TABLE public.action_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    processor_function TEXT NOT NULL, -- Name of the TypeScript function that will process the task
    is_active BOOLEAN NOT NULL DEFAULT true,
    task_type TEXT NOT NULL -- Links to the type of task this template can process
);

-- Add RLS policies
ALTER TABLE public.action_templates ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to authenticated users" 
    ON public.action_templates
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow full access to service role
CREATE POLICY "Allow full access to service role" 
    ON public.action_templates
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Insert the Be Anonymous template
INSERT INTO public.action_templates (
    name,
    description,
    processor_function,
    task_type
) VALUES (
    'Be Anonymous',
    'Sets your display name to Anonymous',
    'anonymousNameProcessor',
    'SetDisplayName'
);
