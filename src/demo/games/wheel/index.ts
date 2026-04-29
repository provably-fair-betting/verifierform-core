import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '../../control-setup';
import { z } from 'zod';
import NoopResult from '../../NoopResult.svelte';
import type { GameDefinition } from '$lib';

export const gameDefinition: GameDefinition = {
  name: 'Wheel',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
    risk: z.enum(['low', 'medium', 'high']),
    segments: z.number().min(10).max(50).step(10),
  }),
  controls: [
    ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
    {
      id: 'risk',
      label: 'Risk',
      type: 'select',
      options: ['low', 'medium', 'high'],
    },
    {
      id: 'segments',
      label: 'Segments',
      type: 'number',
      required: true,
      default: 10,
      min: 10,
      max: 50,
      step: 10,
    },
  ],
  result: NoopResult,
};
