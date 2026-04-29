import { describe, it, expect } from 'vitest';
import {
  isVisible,
  shallowEqual,
  areSearchParamsEqual,
  toUrlSearchParams,
  resolveFormValues,
  defaultsForGame,
  prepareForValidation,
} from '$lib/verifier/control-utils';
import type { Control } from '$lib/verifier/types';

const textControl: Control = { id: 'name', label: 'Name', type: 'text' };
const numberControl: Control = { id: 'nonce', label: 'Nonce', type: 'number', default: 0 };
const selectControl: Control = { id: 'diff', label: 'Difficulty', type: 'select', options: ['easy', 'hard'] };
const hiddenControl: Control = { id: 'token', type: 'hidden' };
const staticControl: Control = { id: 'hash', label: 'Hash', type: 'static', value: 'abc' };

describe('isVisible', () => {
  it('returns false for hidden controls', () => {
    expect(isVisible(hiddenControl, {})).toBe(false);
  });

  it('returns true for static controls', () => {
    expect(isVisible(staticControl, {})).toBe(true);
  });

  it('returns true when no hide function', () => {
    expect(isVisible(textControl, {})).toBe(true);
  });

  it('returns false when hide function returns true', () => {
    const control: Control = { id: 'x', label: 'X', type: 'text', hide: () => true };
    expect(isVisible(control, {})).toBe(false);
  });

  it('returns true when hide function returns false', () => {
    const control: Control = { id: 'x', label: 'X', type: 'text', hide: () => false };
    expect(isVisible(control, {})).toBe(true);
  });
});

describe('shallowEqual', () => {
  it('returns true for same reference', () => {
    const obj = { a: 1 };
    expect(shallowEqual(obj, obj)).toBe(true);
  });

  it('returns true for deeply equal objects', () => {
    expect(shallowEqual({ a: 1, b: '2' }, { a: 1, b: '2' })).toBe(true);
  });

  it('returns false when key counts differ', () => {
    expect(shallowEqual({ a: 1 } as Record<string, unknown>, { a: 1, b: 2 })).toBe(false);
  });

  it('returns false when values differ', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
});

describe('areSearchParamsEqual', () => {
  it('returns true for identical params', () => {
    expect(areSearchParamsEqual(new URLSearchParams('a=1&b=2'), new URLSearchParams('a=1&b=2'))).toBe(true);
  });

  it('returns false when lengths differ', () => {
    expect(areSearchParamsEqual(new URLSearchParams('a=1'), new URLSearchParams('a=1&b=2'))).toBe(false);
  });

  it('returns false when values differ', () => {
    expect(areSearchParamsEqual(new URLSearchParams('a=1'), new URLSearchParams('a=2'))).toBe(false);
  });
});

describe('toUrlSearchParams', () => {
  it('excludes null values', () => {
    const params = toUrlSearchParams({ game: 'dice', name: null }, { name: textControl });
    expect(params.has('name')).toBe(false);
  });

  it('excludes static controls', () => {
    const params = toUrlSearchParams({ game: 'dice', hash: 'abc' }, { hash: staticControl });
    expect(params.has('hash')).toBe(false);
  });

  it('includes hidden controls by default', () => {
    const params = toUrlSearchParams({ game: 'dice', token: 'x' }, { token: hiddenControl });
    expect(params.get('token')).toBe('x');
  });

  it('excludes hidden control when syncToUrl is false', () => {
    const noSync: Control = { id: 'token', type: 'hidden', syncToUrl: false };
    const params = toUrlSearchParams({ game: 'dice', token: 'x' }, { token: noSync });
    expect(params.has('token')).toBe(false);
  });

  it('excludes visible control when syncToUrl is false', () => {
    const noSync: Control = { id: 'name', label: 'Name', type: 'text', syncToUrl: false };
    const params = toUrlSearchParams({ game: 'dice', name: 'bob' }, { name: noSync });
    expect(params.has('name')).toBe(false);
  });

  it('includes unknown keys not in controlsMap', () => {
    const params = toUrlSearchParams({ game: 'dice', extra: 'val' }, {});
    expect(params.get('extra')).toBe('val');
  });
});

describe('resolveFormValues', () => {
  const controls = { name: textControl, nonce: numberControl, diff: selectControl };

  it('reads text param from URL', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice&name=alice'), controls, false);
    expect(result.name).toBe('alice');
  });

  it('parses number param from URL', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice&nonce=5'), controls, false);
    expect(result.nonce).toBe(5);
  });

  it('falls back to first option when select value is invalid', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice&diff=invalid'), controls, false);
    expect(result.diff).toBe('easy');
  });

  it('accepts valid select value from URL', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice&diff=hard'), controls, false);
    expect(result.diff).toBe('hard');
  });

  it('fills select default when applyDefaults is true and param absent', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice'), controls, true);
    expect(result.diff).toBe('easy');
  });

  it('fills numeric default when applyDefaults is true and param absent', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice'), controls, true);
    expect(result.nonce).toBe(0);
  });

  it('does not fill default when param is already present', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice&nonce=7'), controls, true);
    expect(result.nonce).toBe(7);
  });

  it('strips empty string values', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice&name='), controls, false);
    expect(result.name).toBeUndefined();
  });

  it('skips static controls in URL', () => {
    const withStatic = { ...controls, hash: staticControl };
    const result = resolveFormValues(new URLSearchParams('game=dice&hash=xyz'), withStatic, false);
    expect(result.hash).toBeUndefined();
  });

  it('reads hidden controls from URL', () => {
    const withHidden = { ...controls, token: hiddenControl };
    const result = resolveFormValues(new URLSearchParams('game=dice&token=abc'), withHidden, false);
    expect(result.token).toBe('abc');
  });

  it('skips hidden and static controls when filling defaults', () => {
    const withBoth = { ...controls, token: hiddenControl, hash: staticControl };
    const result = resolveFormValues(new URLSearchParams('game=dice'), withBoth, true);
    expect(result.token).toBeUndefined();
    expect(result.hash).toBeUndefined();
  });

  it('skips text control with no default when filling defaults', () => {
    const result = resolveFormValues(new URLSearchParams('game=dice'), controls, true);
    expect(result.name).toBeUndefined();
  });
});

describe('defaultsForGame', () => {
  it('returns game id', () => {
    expect(defaultsForGame([], 'dice').game).toBe('dice');
  });

  it('sets first option for select controls', () => {
    const result = defaultsForGame([selectControl], 'dice');
    expect(result.diff).toBe('easy');
  });

  it('sets default for number controls', () => {
    const result = defaultsForGame([numberControl], 'dice');
    expect(result.nonce).toBe(0);
  });

  it('skips hidden controls', () => {
    const result = defaultsForGame([hiddenControl], 'dice');
    expect(result.token).toBeUndefined();
  });

  it('skips static controls', () => {
    const result = defaultsForGame([staticControl], 'dice');
    expect(result.hash).toBeUndefined();
  });

  it('skips text control with no default', () => {
    const result = defaultsForGame([textControl], 'dice');
    expect(result.name).toBeUndefined();
  });
});

describe('prepareForValidation', () => {
  const controls = { name: textControl, nonce: numberControl };

  it('includes non-null visible values', () => {
    const result = prepareForValidation({ name: 'alice' }, controls);
    expect(result.name).toBe('alice');
  });

  it('excludes null values', () => {
    const result = prepareForValidation({ name: null }, controls);
    expect(result.name).toBeUndefined();
  });

  it('excludes empty string values', () => {
    const result = prepareForValidation({ name: '' }, controls);
    expect(result.name).toBeUndefined();
  });

  it('coerces number control values', () => {
    const result = prepareForValidation({ nonce: '5' }, controls);
    expect(result.nonce).toBe(5);
  });

  it('includes hidden control values', () => {
    const withHidden = { ...controls, token: hiddenControl };
    const result = prepareForValidation({ token: 'abc' }, withHidden);
    expect(result.token).toBe('abc');
  });

  it('excludes static control values', () => {
    const withStatic = { ...controls, hash: staticControl };
    const result = prepareForValidation({ hash: 'xyz' }, withStatic);
    expect(result.hash).toBeUndefined();
  });

  it('includes values for keys not in controlsMap', () => {
    const result = prepareForValidation({ extra: 'val' }, controls);
    expect(result.extra).toBe('val');
  });

  it('excludes hidden controls from hidden field when value is visible control that is hidden', () => {
    const hideControl: Control = { id: 'x', label: 'X', type: 'text', hide: () => true };
    const result = prepareForValidation({ x: 'val' }, { x: hideControl });
    expect(result.x).toBeUndefined();
  });
});
