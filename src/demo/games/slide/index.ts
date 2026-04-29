import { z } from 'zod';
import NoopResult from '../../NoopResult.svelte';
import type { GameDefinition } from '$lib';

export const gameDefinition: GameDefinition = {
  name: 'Slide',
  schema: z.object({
    slidehash: z.string(),
    blockhash: z.string(),
  }),
  controls: [
    {
      id: 'slidehash',
      label: 'Slide Hash',
      type: 'text',
      required: true,
    },
    {
      id: 'blockhash',
      label: 'Block Hash',
      type: 'select',
      options: [
        '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc',
        '00000000000000000000644330e1340fc6e894a95c37060bdd180ed11d068944',
      ],
    },
  ],
  result: NoopResult,
};
