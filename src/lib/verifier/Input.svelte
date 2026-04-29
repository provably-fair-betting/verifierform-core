<script lang="ts">
  import type { Control } from '$lib/verifier/types';
  import StaticField from '$lib/verifier/StaticField.svelte';
  import FieldInput from '$lib/verifier/FieldInput.svelte';

  let {
    control,
    value = $bindable(),
    error,
  }: { control: Control; value?: string; error?: string } = $props();
</script>

{#if control.type === 'hidden'}
  <input type="hidden" id={control.id} bind:value />
{:else if control.type === 'static'}
  <StaticField {control} />
{:else}
  <FieldInput {control} bind:value {error} />
{/if}
