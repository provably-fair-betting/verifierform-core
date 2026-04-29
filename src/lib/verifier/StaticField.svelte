<script lang="ts">
  import type { StaticControl } from '$lib/verifier/types';

  let { control }: { control: StaticControl } = $props();
</script>

<div class="group relative z-0 mt-7 w-full">
  <input
    id={control.id}
    type="text"
    value={control.value}
    disabled
    class="text-md dark:border-gray-60 peer block w-full appearance-none border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:text-white dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 disabled:dark:text-gray-400"
    placeholder=""
    autocomplete="off"
  />
  <label
    for={control.id}
    class="-z1 absolute top-3 left-0 origin-left -translate-y-6 scale-90 transform text-sm text-gray-500 dark:text-gray-400"
  >
    {control.label} (disabled)
  </label>
</div>
