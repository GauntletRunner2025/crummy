-- Create the action_templates table
CREATE TABLE public.action_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    processor_function TEXT NOT NULL, -- Name of the TypeScript function that will process the task
    template_config JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores the template configuration
    output_schema JSONB NOT NULL DEFAULT '{}'::jsonb, -- Defines the expected structure of processed output
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

-- Create action_options table to store the generated options
CREATE TABLE public.action_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id),
    template_id UUID NOT NULL REFERENCES public.action_templates(id),
    option_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for action_options
ALTER TABLE public.action_options ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own action options
CREATE POLICY "Users can view their own action options"
    ON public.action_options
    FOR SELECT
    TO authenticated
    USING (
        task_id IN (
            SELECT id FROM public.tasks 
            WHERE assigned_to = auth.uid()
        )
    );

-- Allow users to create action options for their own tasks
CREATE POLICY "Users can create action options for their tasks"
    ON public.action_options
    FOR INSERT
    TO authenticated
    WITH CHECK (
        task_id IN (
            SELECT id FROM public.tasks 
            WHERE assigned_to = auth.uid()
        )
    );
