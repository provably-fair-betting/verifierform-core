<script lang="ts">
  import type { TextControl, NumberControl, SelectControl } from '$lib/verifier/types';

  let {
    control,
    value = $bindable(),
    error,
  }: {
    control: TextControl | NumberControl | SelectControl;
    value?: string;
    error?: string;
  } = $props();

  const inputClass = [
    'text-md block w-full appearance-none border-0 border-b bg-transparent px-0 py-2.5 text-gray-900',
    'focus:ring-0 focus:outline-none peer',
  ];

  const labelClass = [
    'absolute -translate-y-6 scale-90 transform text-sm text-gray-500 duration-300 peer-focus:font-medium dark:text-gray-400',
    'top-3 left-0 -z-10 origin-left peer-focus:inset-s-0',
    'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-100',
  ];
</script>

<div class="group relative z-0 mt-5 w-full">
  {#if control.type === 'select'}
    <select
      id={control.id}
      bind:value
      {...control.required && { required: true }}
      class={[
        ...inputClass,
        'border-gray-300 focus:border-purple-500 dark:border-gray-400 dark:text-white focus:dark:border-purple-400',
        'border-b-2',
      ]}
      placeholder=""
      {...error && { 'aria-invalid': true, 'aria-errormessage': `${control.id}-error-message` }}
    >
      {#each control.options as opt (opt)}
        <option value={opt}>{opt}</option>
      {/each}
    </select>
  {:else}
    <input
      id={control.id}
      type={control.type}
      bind:value
      {...control.type === 'number' && { min: control.min, max: control.max, step: control.step }}
      {...control.required && { required: true }}
      class={[
        ...inputClass,
        'dark:text-white',
        error
          ? 'border-red-600 dark:border-red-500'
          : 'border-gray-300 focus:border-purple-500 dark:border-gray-400 focus:dark:border-purple-400',
      ]}
      placeholder=""
      autocomplete="off"
      {...error && { 'aria-invalid': true, 'aria-errormessage': `${control.id}-error-message` }}
    />
  {/if}

  <label
    for={control.id}
    class={[
      ...labelClass,
      error
        ? 'peer-focus:text-red-600 peer-focus:dark:text-red-500'
        : 'peer-focus:text-purple-500 peer-focus:dark:text-purple-400',
    ]}
  >
    {control.label}{control.required ? '*' : ''}
  </label>

  {#if error}
    <p id={`${control.id}-error-message`} class="mt-2 text-xs text-red-600 dark:text-red-500">
      {error}
    </p>
  {/if}
</div>
