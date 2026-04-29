import type { GameDefinition } from '$lib';
import { z } from 'zod';
import NoopResult from '../../NoopResult.svelte';
import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '../../control-setup';

export const gameDefinition: GameDefinition = {
  name: 'Plinko',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
    risk: z.enum(['low', 'medium', 'high', 'norow']),
    rows: z.number().min(8).max(16).optional(),
  }).superRefine((data, ctx) => {
    if (data.risk !== 'norow' && data.rows === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rows is required when risk is not 'norow'",
        path: ['rows'],
      });
    }
  }),
  controls: [
    ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
    {
      id: 'risk',
      label: 'Game Row',
      type: 'select',
      options: ['low', 'medium', 'high', 'norow'],
    },
    {
      id: 'rows',
      label: 'Row',
      type: 'number',
      hide: (formValues) => formValues?.risk === 'norow',
      required: true,
      default: 8,
      min: 8,
      max: 16,
    },
  ],
  result: NoopResult,
};
