<script lang="ts">
  import type { GameEntry } from '$lib/verifier/types';
  import { useGameLoader } from '$lib/verifier/use-game-loader.svelte';
  import {
    isVisible,
    shallowEqual,
    areSearchParamsEqual,
    toUrlSearchParams,
    resolveFormValues,
    defaultsForGame,
    prepareForValidation,
  } from '$lib/verifier/control-utils';
  import { effectWithPrevious } from '$lib/verifier/effect-with-previous.svelte';
  import Input from './Input.svelte';
  import GamePicker from './GamePicker.svelte';

  import { page } from '$app/state';
  import { goto, afterNavigate } from '$app/navigation';
  import { onMount, untrack } from 'svelte';
  import { browser } from '$app/environment';

  let { games }: { games: Record<string, GameEntry> } = $props();

  let gameIds = $derived(Object.keys(games));

  const gameLoader = useGameLoader(() => games);

  // Pre-load the initial game on mount without consuming firstNavigation.
  onMount(() => {
    const initialGame = browser ? page.url.searchParams.get('game') : null;
    if (initialGame && initialGame in games) gameLoader.loadGame(initialGame);
  });

  // === Form state ===

  let formValues = $state<Record<string, unknown>>(
    Object.fromEntries(browser ? page.url.searchParams.entries() : [])
  );
  let firstNavigation = $state(true);
  let showExplanation = $state(false);

  let game = $derived(formValues.game as string);
  let allControls = $derived(gameLoader.definition?.controls);
  let controlsMap = $derived(Object.fromEntries((allControls ?? []).map((c) => [c.id, c])));
  let controls = $derived(allControls?.filter((c) => isVisible(c, formValues)));

  // === Validation ===

  let schema = $derived(gameLoader.definition?.schema);
  let validationResult = $derived(schema?.safeParse(prepareForValidation(formValues, controlsMap)));
  let validationErrors = $derived(
    validationResult?.success ? {} : (validationResult?.error.flatten().fieldErrors ?? {})
  );
  let formValid = $derived(validationResult?.success === true);

  // === Result / Explanation components ===

  let Result = $derived(gameLoader.definition?.result);
  let Explanation = $derived(gameLoader.definition?.explanation);

  // === Restore/clear field values when control visibility changes ===

  let visibilityState = $derived({
    game,
    loaded: !!gameLoader.definition,
    visibility: Object.fromEntries(
      (allControls ?? []).map((c) => [c.id, isVisible(c, formValues)])
    ),
  });

  effectWithPrevious(
    () => visibilityState,
    (prev, curr) => {
      if (!prev || !prev.loaded || prev.game !== curr.game) return;
      for (const key in curr.visibility) {
        const control = controlsMap[key];
        if (!control || control.type === 'hidden' || control.type === 'static') continue;
        if (curr.visibility[key] && !prev.visibility[key]) {
          formValues[key] =
            'default' in control && control.default !== undefined ? control.default : null;
        } else if (!curr.visibility[key] && prev.visibility[key]) {
          delete formValues[key];
        }
      }
    }
  );

  // === URL sync (debounced) ===

  let changeTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  $effect(() => {
    if (!(browser && game && game in games && game === page.url.searchParams.get('game'))) return;
    if (changeTimeout !== undefined) clearTimeout(changeTimeout);
    const next = toUrlSearchParams(formValues, controlsMap);
    if (!areSearchParamsEqual(next, page.url.searchParams)) {
      showExplanation = false;
      changeTimeout = setTimeout(() => shallowNavigate(`?${next}`), 350);
    }
  });

  // === Navigation ===

  afterNavigate(async () => {
    const gameId = page.url.searchParams.get('game');
    if (gameId === null || !(gameId in games)) {
      await changeGame(gameIds[0]);
      return;
    }

    const def = await gameLoader.loadGame(gameId);
    if (!def) return;

    const isFirst = firstNavigation;
    if (isFirst) untrack(() => (firstNavigation = false));

    const defControlsMap = Object.fromEntries(def.controls.map((c) => [c.id, c]));
    const next = resolveFormValues(page.url.searchParams, defControlsMap, isFirst);
    if (!shallowEqual(formValues, next)) formValues = next;
  });

  async function changeGame(gameId: string) {
    const def = await gameLoader.loadGame(gameId);
    if (!def) return;
    formValues = defaultsForGame(def.controls, gameId);
    showExplanation = false;
    shallowNavigate(`?${new URLSearchParams(Object.entries(formValues) as string[][])}`);
  }

  function shallowNavigate(path: string) {
    goto(path, { replaceState: true, keepFocus: true, noScroll: true });
  }
</script>

<div class="mx-auto max-w-xl rounded-b-lg p-4">
  <div class="mb-7">
    <GamePicker {games} selectedGame={game} onselect={changeGame} />
  </div>

  {#if gameLoader.isLoading}
    <div class="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
  {:else}
    <div class="mb-6 space-y-3">
      {#each controls ?? [] as control (control.id)}
        <Input
          {control}
          bind:value={formValues[control.id] as string}
          error={validationErrors[control.id]?.[0]}
        />
      {/each}
    </div>

    {#if formValid && Result}
      <div class="mb-4 rounded dark:text-white">
        <Result {formValues} />
      </div>
      {#if Explanation}
        <button
          class={[
            'm-auto block px-5 py-2.5 text-sm font-medium text-white focus:ring-0 focus:outline-none',
            'bg-purple-500 hover:bg-purple-600',
          ]}
          onclick={() => (showExplanation = !showExplanation)}
        >
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </button>
        <div class={['dark:text-white', showExplanation ? '' : 'hidden']}>
          <Explanation {formValues} />
        </div>
      {/if}
    {/if}
  {/if}
</div>
