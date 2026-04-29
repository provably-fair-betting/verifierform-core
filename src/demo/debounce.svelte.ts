import { untrack } from 'svelte';

function debounce<T>(fn: (value: T) => void, delay: number): (value: T) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}

export function debouncer<T, U>(
  getter: () => T,
  action: (value: T) => U,
  delay: number
): () => { debouncing: boolean; value: U | null } {
  let current = $state<{ debouncing: boolean; value: U | null }>({ debouncing: true, value: null });
  const update = debounce((v: T) => (current = { debouncing: false, value: action(v) }), delay);

  $effect(() => {
    untrack(() => (current.debouncing = true));
    update(getter());
  });

  return () => current;
}
