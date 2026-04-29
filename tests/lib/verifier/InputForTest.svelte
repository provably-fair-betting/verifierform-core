<script lang="ts">
  import { untrack } from 'svelte';
  import type { Control } from '$lib/verifier/types';
  import Input from '$lib/verifier/Input.svelte';

  let { control, value, error }: { control: Control; value?: string; error?: string } = $props();

  let boundValue = $state<string>(untrack(() => value || ''));
</script>

<Input {control} bind:value={boundValue} {error} />
