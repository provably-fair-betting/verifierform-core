<script lang="ts">
  import HighlightLink from '../../layout/HighlightLink.svelte';
  import { diceRollEquation } from './dice-utils';

  const { stepNumber, float }: { stepNumber: number; float: number } = $props();

  const equation = $derived(diceRollEquation(float));
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into roll number</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Dice Roll</span>
    section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>
  <pre
    class="text-sm whitespace-pre-wrap text-gray-500 dark:text-gray-400"
    data-testid="dice-formula">{equation}</pre>
</div>
