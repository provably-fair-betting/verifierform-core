import ByteGenerator from '../../../src/demo/generator/byte-generator';
import { describe, it, expect } from 'vitest';

describe('StakeByteGenerator', () => {
  it('generate bytes correctly for a given seed', () => {
    const byteGenerator = ByteGenerator({
      clientSeed: 'iyAyNGKPsa',
      serverSeed: '5d43f77f53fec7d115180136105400f0fd2a1f20b681b6b54a289c207923b190',
      nonce: 29,
    });

    [
      107, 36, 194, 168, 252, 117, 68, 165, 155, 3, 141, 117, 143, 62, 227, 104, 176, 154, 220, 192,
      9, 38, 250, 29, 69, 86, 41, 185, 2, 244, 169, 99, 134, 7,
    ].forEach((byte) => expect(byteGenerator.next().value).to.equal(byte));
  });
});
