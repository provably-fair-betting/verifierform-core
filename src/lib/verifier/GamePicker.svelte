<script lang="ts">
  import type { GameEntry } from './types';

  let {
    games,
    selectedGame,
    onselect,
  }: {
    games: Record<string, GameEntry>;
    selectedGame: string;
    onselect: (gameId: string) => void;
  } = $props();

  let search = $state('');

  const filtered = $derived(
    Object.entries(games).filter(([, entry]) =>
      entry.name.toLowerCase().includes(search.toLowerCase()),
    ),
  );
</script>

<div>
  <div class="relative mb-3">
    <svg
      class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clip-rule="evenodd"
      />
    </svg>
    <input
      type="search"
      bind:value={search}
      placeholder="Search games…"
      aria-label="Search games"
      class="block w-full rounded-md border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:ring-0 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
    />
  </div>

  {#if filtered.length === 0}
    <p class="py-6 text-center text-sm text-gray-400 dark:text-gray-500">No games found.</p>
  {:else}
    <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {#each filtered as [gameId, entry] (gameId)}
        {@const isSelected = gameId === selectedGame}
        <button
          type="button"
          onclick={() => onselect(gameId)}
          class={[
            'group flex flex-col items-center overflow-hidden rounded-lg border-2 transition-all focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:outline-none',
            isSelected
              ? 'border-purple-500 shadow-md dark:border-purple-400'
              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600',
          ]}
          aria-pressed={isSelected}
        >
          {#if entry.image}
            <img
              src={entry.image}
              alt={entry.name}
              class="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
          {:else}
            <div
              class="flex aspect-[3/4] w-full items-center justify-center bg-gray-100 text-2xl font-bold text-gray-400 dark:bg-gray-800 dark:text-gray-600"
            >
              {entry.name[0].toUpperCase()}
            </div>
          {/if}
          <span
            class={[
              'w-full truncate px-1 py-1 text-center text-xs font-medium',
              isSelected
                ? 'bg-purple-500 text-white dark:bg-purple-500'
                : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-700',
            ]}
          >
            {entry.name}
          </span>
        </button>
      {/each}
    </div>
  {/if}
</div>
