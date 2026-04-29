import type { StakeSeed } from '../types';
import ByteGenerator from './byte-generator';

export default function* FloatGenerator(seed: StakeSeed): Generator<number, number, number> {
  const { serverSeed, clientSeed, nonce, cursor = 0 } = seed;
  const rng = ByteGenerator({ serverSeed, clientSeed, nonce, cursor });

  while (true) {
    let result = 0;
    for (let i = 0; i < 4; i++) {
      result += rng.next().value / 256 ** (i + 1);
    }
    yield result;
  }
}
