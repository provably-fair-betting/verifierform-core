import { SHA256 } from '@stablelib/sha256';
import { hmac as createHmac } from '@stablelib/hmac';
import { encode as toUInt8Array } from '@stablelib/utf8';
import type { StakeSeed } from '../types';

export default function* ByteGenerator(seed: StakeSeed): Generator<number, number, number> {
  const { serverSeed, clientSeed, nonce, cursor = 0 } = seed;

  let currentRound = Math.floor(cursor / 32);
  let currentRoundCursor = cursor - currentRound * 32;

  while (true) {
    const hmac = createHmac(
      SHA256,
      toUInt8Array(serverSeed),
      toUInt8Array(`${clientSeed}:${nonce}:${currentRound}`)
    );

    while (currentRoundCursor < 32) {
      yield Number(hmac[currentRoundCursor]);
      currentRoundCursor += 1;
    }
    currentRoundCursor = 0;
    currentRound += 1;
  }
}
