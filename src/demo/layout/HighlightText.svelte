<script lang="ts">
  import type { Snippet } from 'svelte';

  const { className, children }: { className?: string; children: Snippet } = $props();
</script>

<span class="font-bold text-purple-500 dark:text-purple-400 {className}">{@render children()}</span>
