<script lang="ts">
  import { debouncer } from '../../debounce.svelte';
  import { seedFromFormValues, generateFloat } from './dice-utils';
  import FloatGenerationStep from './FloatGenerationStep.svelte';
  import DiceResultStep from './DiceResultStep.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived(seedFromFormValues(formValues));
  const floatResult = $derived.by(debouncer(() => seed, generateFloat, 350));
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if floatResult.debouncing}
      <p class="text-center text-base">
        <span class="text-sm text-gray-500 italic dark:text-gray-400">Computing...</span>
      </p>
    {:else}
      <FloatGenerationStep stepNumber={1} resultIndex={0} {seed} float={floatResult.value!} />
      <DiceResultStep stepNumber={2} float={floatResult.value!} />
    {/if}
  </div>
</div>
