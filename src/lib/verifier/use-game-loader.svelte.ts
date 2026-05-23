import { SvelteMap } from 'svelte/reactivity';
import type { GameDefinition, GameEntry } from '$lib/verifier/types';

export function useGameLoader(getGames: () => Record<string, GameEntry>) {
  const cache = new SvelteMap<string, GameDefinition>();
  let requestedId: string | null = null;

  let definition = $state<GameDefinition | undefined>();
  let isLoading = $state(false);

  async function fetchAndCache(gameId: string): Promise<GameDefinition> {
    const cached = cache.get(gameId);
    if (cached) return cached;
    const def = await getGames()[gameId].loader();
    cache.set(gameId, def);
    return def;
  }

  async function loadGame(gameId: string): Promise<GameDefinition | undefined> {
    requestedId = gameId;
    if (!cache.has(gameId)) isLoading = true;
    const def = await fetchAndCache(gameId);
    if (requestedId !== gameId) return undefined;
    definition = def;
    isLoading = false;
    return def;
  }

  return {
    get definition() {
      return definition;
    },
    get isLoading() {
      return isLoading;
    },
    loadGame,
  };
}
