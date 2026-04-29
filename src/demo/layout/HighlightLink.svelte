<script lang="ts">
  import type { Snippet } from 'svelte';

  const { className, href, children }: { className?: string; href: string; children: Snippet } =
    $props();
</script>

<a class="text-purple-500 hover:underline dark:text-purple-400 {className}" target="_blank" {href}>
  {@render children()}
</a>
