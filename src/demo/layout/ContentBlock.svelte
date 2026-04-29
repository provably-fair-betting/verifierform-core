<script lang="ts">
  import type { Snippet } from 'svelte';

  const { className, children }: { className?: string; children: Snippet } = $props();
</script>

<div class="{className} bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
  {@render children()}
</div>
