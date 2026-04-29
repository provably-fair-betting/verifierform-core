import type { Component } from 'svelte';
import type { z } from 'zod';

interface VisibleControlBase {
  id: string;
  label: string;
}

export interface TextControl extends VisibleControlBase {
  type: 'text';
  required?: boolean;
  syncToUrl?: boolean;
  hide?: (formValues: Record<string, unknown>) => boolean;
  default?: string;
}

export interface NumberControl extends VisibleControlBase {
  type: 'number';
  required?: boolean;
  syncToUrl?: boolean;
  hide?: (formValues: Record<string, unknown>) => boolean;
  default?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface SelectControl extends VisibleControlBase {
  type: 'select';
  options: string[];
  required?: boolean;
  syncToUrl?: boolean;
  hide?: (formValues: Record<string, unknown>) => boolean;
}

/** URL-synced state bucket — never rendered, lives only in formValues and URL params. */
export interface HiddenControl {
  id: string;
  type: 'hidden';
  syncToUrl?: boolean; // defaults to true
}

/** Read-only display field with a fixed value — rendered but not part of form state. */
export interface StaticControl {
  id: string;
  label: string;
  type: 'static';
  value: string;
}

export type Control = TextControl | NumberControl | SelectControl | HiddenControl | StaticControl;

export interface GameDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
  name: string;
  controls: Control[];
  schema: T;
  result: Component<{ formValues: Record<string, unknown> }>;
  explanation?: Component<{ formValues: Record<string, unknown> }>;
}

export interface GameEntry {
  name: string;
  loader: () => Promise<GameDefinition>;
}
