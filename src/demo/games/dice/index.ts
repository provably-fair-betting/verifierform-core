import DiceResult from './DiceResult.svelte';
import DiceExplanation from './DiceExplanation.svelte';
import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '../../control-setup';
import type { GameDefinition } from '$lib';

export const gameDefinition: GameDefinition = {
  name: 'Dice',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  result: DiceResult,
  explanation: DiceExplanation,
};
