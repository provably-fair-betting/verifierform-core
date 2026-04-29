<script lang="ts">
  import { debouncer } from '../../debounce.svelte';
  import { seedFromFormValues, generateFloat, diceRollNumber } from './dice-utils';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived(seedFromFormValues(formValues));
  const rollResult = $derived.by(
    debouncer(
      () => seed,
      (s) => diceRollNumber(generateFloat(s)),
      350
    )
  );
</script>

{#if rollResult.debouncing}
  <p class="text-center text-base">
    <span class="text-sm text-gray-500 italic dark:text-gray-400">Computing...</span>
  </p>
{:else}
  <p data-testid="dice-result" class="text-center text-base">
    you rolled a <span class="text-xl text-purple-500 dark:text-purple-400">
      {rollResult.value!.toFixed(2)}
    </span>
  </p>
{/if}
