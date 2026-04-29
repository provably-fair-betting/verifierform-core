import { z } from 'zod';
import NoopResult from '../../NoopResult.svelte';
import type { GameDefinition } from '$lib';

export const gameDefinition: GameDefinition = {
  name: 'Crash',
  schema: z.object({
    gamehash: z.string(),
  }),
  controls: [
    {
      id: 'gamehash',
      label: 'Game Hash',
      type: 'text',
      required: true,
    },
    {
      id: 'blockhash',
      label: 'Block Hash',
      type: 'static',
      value: '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4',
    },
  ],
  result: NoopResult,
};
