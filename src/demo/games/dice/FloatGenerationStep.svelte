<script lang="ts">
  import type { FloatExplanationStepProps } from './dice-utils';
  import { fade } from 'svelte/transition';
  import HighlightText from '../../layout/HighlightText.svelte';
  import ContentBlock from '../../layout/ContentBlock.svelte';
  import HighlightLink from '../../layout/HighlightLink.svelte';
  import { computeFloatStep, HEX_CHARS_IN_HMAC, HEX_CHARS_FOR_FLOAT } from './dice-utils';

  const { stepNumber, resultIndex, seed, float }: FloatExplanationStepProps = $props();

  const step = $derived(computeFloatStep(resultIndex, seed));
</script>

{#key step.cursor}
  <div transition:fade={{ duration: 500 }}>
    <div class="text-center">
      <p class="mb-2 text-xl">Step {stepNumber}</p>
      <p class="text-base">Extract float based on client seed, server seed, and nonce</p>
      <p class="mb-7 text-sm text-gray-500 dark:text-gray-400">
        Refer to scripts on the <HighlightLink
          href="https://stake.com/provably-fair/implementation"
        >
          implementation
        </HighlightLink>
        and
        <HighlightLink href="https://stake.com/provably-fair/conversions">conversion</HighlightLink>
        pages
      </p>
    </div>

    <ContentBlock className="p-5 font-mono text-xs">
      <p>resultIndex = {resultIndex}</p>
      <p>hexCharsInHmac = {HEX_CHARS_IN_HMAC}</p>
      <p>hexCharsForFloat = {HEX_CHARS_FOR_FLOAT}</p>
      <p class="mt-4">round</p>
      <p>
        = <HighlightText>&lbrace;resultIndex&rbrace;</HighlightText> /
        <HighlightText>&lbrace;hexCharsForFloat&rbrace;</HighlightText>
      </p>
      <p>
        = <HighlightText>{resultIndex}</HighlightText> /
        <HighlightText>{HEX_CHARS_FOR_FLOAT}</HighlightText>
      </p>
      <p>= {step.round}</p>

      <p class="mt-4">cursor</p>
      <p>
        = (<HighlightText>&lbrace;resultIndex&rbrace;</HighlightText> *
        <HighlightText>&lbrace;hexCharsForFloat&rbrace;</HighlightText>) %
        <HighlightText>&lbrace;hexCharsInHmac&rbrace;</HighlightText>
      </p>
      <p>
        = (<HighlightText>{resultIndex}</HighlightText> *
        <HighlightText>{HEX_CHARS_FOR_FLOAT}</HighlightText>) %
        <HighlightText>{HEX_CHARS_IN_HMAC}</HighlightText>
      </p>
      <p>= {step.cursor}</p>

      <p class="mt-4">hmac</p>
      <p>= hmac_sha256(</p>
      <p class="indent-8">
        key &nbsp;= <HighlightText>&lbrace;serverseed&rbrace;</HighlightText>
      </p>
      <p class="indent-8">
        data = <HighlightText>
          &lbrace;clientseed&rbrace;:&lbrace;nonce&rbrace;:&lbrace;round&rbrace;
        </HighlightText>
      </p>
      <p class="indent-4">)</p>
      <p>= hmac_sha256(</p>
      <p class="truncate indent-8">
        key &nbsp;= <HighlightText>{seed.serverSeed}</HighlightText>
      </p>
      <p class="truncate indent-8">
        data = <HighlightText>{seed.clientSeed}:{seed.nonce}:{step.round}</HighlightText>
      </p>
      <p class="indent-4">)</p>
      <p class="break-all">
        = <span class="text-xs">{step.hmac}</span>
      </p>

      <p class="mt-4">hexes</p>
      <p>= substring(</p>
      <p class="indent-8">
        value = <HighlightText>&lbrace;hmac&rbrace;</HighlightText>
      </p>
      <p class="indent-8">
        start = <HighlightText>&lbrace;cursor&rbrace;</HighlightText>
      </p>
      <p class="indent-8">
        take &nbsp;= <HighlightText>&lbrace;hexCharsForFloat&rbrace;</HighlightText>
      </p>
      <p class="indent-4">)</p>
      <p>= substring(</p>
      <p class="truncate indent-8">
        value = <HighlightText>{step.hmac}</HighlightText>
      </p>
      <p class="indent-8">
        start = <HighlightText>{step.cursor}</HighlightText>
      </p>
      <p class="indent-8">
        take &nbsp;= <HighlightText>{HEX_CHARS_FOR_FLOAT}</HighlightText>
      </p>
      <p class="indent-4">)</p>
      <p class="break-all">
        = {step.hmac.substring(0, step.cursor)}<HighlightText className="text-base">
          {step.hmac.substring(step.cursor, step.cursor + HEX_CHARS_FOR_FLOAT)}
        </HighlightText>
        <span class="text-xs text-gray-400">
          {step.hmac.substring(step.cursor + HEX_CHARS_FOR_FLOAT)}
        </span>
      </p>
    </ContentBlock>

    <div class="relative mt-4 overflow-x-auto">
      <ContentBlock>
        <table class="w-full text-left text-sm">
          <tbody>
            <tr class="border-b border-gray-300 dark:border-gray-700">
              <th
                scope="row"
                class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
              >
                hex
              </th>
              {#each step.hexes as hex}
                <td class="px-6 py-4 font-mono">{hex}</td>
              {/each}
            </tr>
            <tr class="border-none">
              <th
                scope="row"
                class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
              >
                byte
              </th>
              {#each step.bytes as byte}
                <td class="px-6 py-4 font-mono">{byte}</td>
              {/each}
            </tr>
          </tbody>
        </table>
      </ContentBlock>
    </div>

    <div class="relative mt-4 overflow-x-auto font-mono">
      <ContentBlock>
        <table class="w-full text-left text-sm">
          <tbody>
            {#each step.bytes as byte, i}
              <tr class="border-b border-gray-300 dark:border-gray-700">
                <td class="px-4"></td>
                <td class="px-2 py-4">{(byte / 256 ** (i + 1)).toFixed(12)}</td>
                <td class="px-6 py-4">({('' + byte).padStart(3, '0')} / (256 ^ {i + 1}))</td>
              </tr>
            {/each}
            <tr class="border-none border-gray-200 dark:border-gray-700">
              <td class="px-4">=</td>
              <td class="px-2 py-4">{float.toFixed(12)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </ContentBlock>
    </div>
  </div>
{/key}
