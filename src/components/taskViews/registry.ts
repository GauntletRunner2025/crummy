import { ComponentType } from 'react';
import { TaskTypeViewProps } from './types';
import { OnboardingView } from './OnboardingView';
import { SetDisplayNameView } from './SetDisplayNameView';
import { SetDisplayNameCutesyView } from './SetDisplayNameCutesyView';
import { SetDisplayNameAnonymousView } from './SetDisplayNameAnonymousView';

// Define all available view components
export const VIEW_COMPONENTS = {
  OnboardingView,
  SetDisplayNameView,
  SetDisplayNameCutesyView,
  SetDisplayNameAnonymousView,
} as const;

// Type for component names
export type ViewComponentName = keyof typeof VIEW_COMPONENTS;

// Type guard to check if a string is a valid component name
export function isValidViewComponent(name: string): name is ViewComponentName {
  return name in VIEW_COMPONENTS;
}

// Get component by name with type safety
export function getViewComponent(name: string): ComponentType<TaskTypeViewProps> | null {
  if (isValidViewComponent(name)) {
    return VIEW_COMPONENTS[name];
  }
  return null;
}
