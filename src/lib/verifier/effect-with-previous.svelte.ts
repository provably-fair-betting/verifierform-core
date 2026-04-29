export function effectWithPrevious<T>(
  getter: () => T,
  callback: (prev: T | undefined, current: T) => void
): void {
  let prev: T | undefined = undefined;

  $effect(() => {
    const current = getter();
    callback(prev, current);
    prev = current;
  });
}
