-- Add onboarding task view
insert into public.derived_task_views (task_type_id, name, component_name, is_default, description)
values
    ('onboarding', 'Default', 'OnboardingView', true, 'Process new user onboarding');
