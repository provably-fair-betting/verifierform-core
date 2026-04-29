import type { Control } from '$lib/verifier/types';

// === Visibility ===

export function isVisible(control: Control, formValues: Record<string, unknown>): boolean {
  if (control.type === 'hidden') return false;
  if (control.type === 'static') return true;
  return !('hide' in control) || !control.hide?.(formValues);
}

// === Equality ===

export function shallowEqual<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) return true;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every((k) => obj1[k] === obj2[k]);
}

export function areSearchParamsEqual(a: URLSearchParams, b: URLSearchParams): boolean {
  const aEntries = [...a];
  if (aEntries.length !== [...b].length) return false;
  return aEntries.every(([k, v]) => b.get(k) === v);
}

// === URL sync ===

/** Returns the subset of form values that belong in the URL. */
export function toUrlSearchParams(
  formValues: Record<string, unknown>,
  controlsMap: Record<string, Control>
): URLSearchParams {
  const entries = Object.entries(formValues).filter(([k, v]) =>
    syncesToUrl(k, v, controlsMap)
  ) as string[][];
  return new URLSearchParams(entries);
}

function syncesToUrl(key: string, value: unknown, controlsMap: Record<string, Control>): boolean {
  if (value === null) return false;
  const control = controlsMap[key];
  if (!control) return true;
  if (control.type === 'static') return false;
  if (control.type === 'hidden') return control.syncToUrl ?? true;
  return control.syncToUrl !== false;
}

// === Form value resolution ===

/** Resolves form values from URL params, optionally filling in defaults for missing controls. */
export function resolveFormValues(
  searchParams: URLSearchParams,
  controlsMap: Record<string, Control>,
  applyDefaults: boolean
): Record<string, unknown> {
  const values: Record<string, unknown> = { game: searchParams.get('game')! };
  if (applyDefaults) fillMissingDefaults(values, searchParams, controlsMap);
  readParams(values, searchParams, controlsMap);
  stripEmpty(values);
  return values;
}

function fillMissingDefaults(
  values: Record<string, unknown>,
  searchParams: URLSearchParams,
  controlsMap: Record<string, Control>
): void {
  for (const [id, control] of Object.entries(controlsMap)) {
    if (control.type === 'hidden' || control.type === 'static') continue;
    if (searchParams.has(id)) continue;
    if (control.type === 'select') {
      values[id] = control.options[0];
    } else if ('default' in control && control.default !== undefined) {
      values[id] = control.default;
    }
  }
}

function readParams(
  values: Record<string, unknown>,
  searchParams: URLSearchParams,
  controlsMap: Record<string, Control>
): void {
  for (const [key, raw] of searchParams) {
    if (key === 'game') continue;
    const control = controlsMap[key];
    if (!control || control.type === 'static') continue;
    values[key] = parseControlValue(control, raw);
  }
}

function parseControlValue(control: Control, raw: string): unknown {
  if (control.type === 'hidden') return raw;
  if (control.type === 'select') return control.options.includes(raw) ? raw : control.options[0];
  if (control.type === 'number') return parseInt(raw);
  return raw;
}

function stripEmpty(values: Record<string, unknown>): void {
  for (const key of Object.keys(values)) {
    if (values[key] === null || values[key] === '') delete values[key];
  }
}

/** Returns the default form values when switching to a game. */
export function defaultsForGame(
  controls: Control[],
  gameId: string
): Record<string, string | number | null> {
  const values: Record<string, string | number | null> = { game: gameId };
  for (const control of controls) {
    if (control.type === 'hidden' || control.type === 'static') continue;
    if (control.type === 'select') {
      values[control.id] = control.options[0];
    } else if ('default' in control && control.default !== undefined) {
      values[control.id] = control.default;
    }
  }
  return values;
}

// === Validation ===

/** Strips non-validatable fields and coerces types before passing to a Zod schema. */
export function prepareForValidation(
  formValues: Record<string, unknown>,
  controlsMap: Record<string, Control>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(formValues)
      .filter(([k, v]) => isValidatable(k, v, controlsMap, formValues))
      .map(([k, v]) => [k, toTypedValue(k, v, controlsMap)])
  );
}

function isValidatable(
  key: string,
  value: unknown,
  controlsMap: Record<string, Control>,
  formValues: Record<string, unknown>
): boolean {
  if (value === null || value === '') return false;
  const control = controlsMap[key];
  if (!control) return true;
  if (control.type === 'static') return false;
  if (control.type === 'hidden') return true;
  return isVisible(control, formValues);
}

function toTypedValue(key: string, value: unknown, controlsMap: Record<string, Control>): unknown {
  return controlsMap[key]?.type === 'number' ? parseInt(value as string) : value;
}
