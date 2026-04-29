import type { StakeSeed } from '../../types';
import FloatGenerator from '../../generator/float-generator';
import { hmac as createHmac } from '@stablelib/hmac';
import { SHA256 } from '@stablelib/sha256';
import { encode as toUInt8Array } from '@stablelib/utf8';
import { encode as toHex } from '@stablelib/hex';

export const HEX_CHARS_IN_HMAC = 64;
export const HEX_CHARS_FOR_FLOAT = 8;

export interface FloatStep {
  round: number;
  cursor: number;
  hmac: string;
  hexes: string[];
  bytes: number[];
}

export interface FloatExplanationStepProps {
  stepNumber: number;
  resultIndex: number;
  float: number;
  seed: StakeSeed;
}

export function seedFromFormValues(formValues: Record<string, unknown>): StakeSeed {
  return {
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
  };
}

export function generateFloat(seed: StakeSeed): number {
  return FloatGenerator(seed).next().value;
}

export function diceRollNumber(float: number): number {
  return Math.floor(float * 10001) / 100;
}

export function diceRollEquation(float: number): string {
  return `floor(${float.toFixed(12)} * 10001) / 100 = ${diceRollNumber(float).toFixed(2)}`;
}

export function computeFloatStep(resultIndex: number, seed: StakeSeed): FloatStep {
  const round = Math.floor(resultIndex / HEX_CHARS_FOR_FLOAT);
  const cursor = (resultIndex * HEX_CHARS_FOR_FLOAT) % HEX_CHARS_IN_HMAC;
  const hmacHex = toHex(
    createHmac(
      SHA256,
      toUInt8Array(seed.serverSeed),
      toUInt8Array(`${seed.clientSeed}:${seed.nonce}:${round}`)
    )
  );
  const hexes = hmacHex.substring(cursor, cursor + HEX_CHARS_FOR_FLOAT).match(/.{1,2}/g) ?? [];
  const bytes = hexes.map((hex) => parseInt(hex, 16));
  return { round, cursor, hmac: hmacHex, hexes, bytes };
}
