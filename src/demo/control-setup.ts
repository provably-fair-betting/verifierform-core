import type { Control } from '$lib';
import { z } from 'zod';

export const CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA = z.object({
  clientseed: z.string(),
  serverseed: z.string(),
  nonce: z.number().nonnegative(),
});

export const CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS: Control[] = [
  {
    id: 'clientseed',
    label: 'Client Seed',
    type: 'text',
    required: true,
  },
  {
    id: 'serverseed',
    label: 'Server Seed',
    type: 'text',
    required: true,
  },
  {
    id: 'nonce',
    label: 'Nonce',
    type: 'number',
    required: true,
    default: 0,
    min: 0,
  },
];
