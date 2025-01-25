-- Insert the Be Anonymous template
INSERT INTO public.action_templates (
    name,
    description,
    processor_function,
    template_config,
    output_schema,
    task_type
) VALUES (
    'Be Anonymous',
    'Sets your display name to Anonymous',
    'anonymousNameProcessor',
    jsonb_build_object(
        'displayName', 'Anonymous'
    ),
    jsonb_build_object(
        'type', 'object',
        'properties', jsonb_build_object(
            'displayName', jsonb_build_object(
                'type', 'string',
                'description', 'The display name to set'
            )
        )
    ),
    'SetDisplayName'
);
