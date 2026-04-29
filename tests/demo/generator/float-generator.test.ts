import FloatGenerator from '../../../src/demo/generator/float-generator';
import { describe, it, expect } from 'vitest';

describe('StakeFloatGenerator', () => {
  it('generate floats correctly for a given seed', () => {
    const floatGenerator = FloatGenerator({
      clientSeed: 'iyAyNGKPsa',
      serverSeed: '5d43f77f53fec7d115180136105400f0fd2a1f20b681b6b54a289c207923b190',
      nonce: 29,
    });

    [
      0.418529668823, 0.986164369853, 0.605522957863, 0.559553349391, 0.689863011241,
      0.035750991898, 0.270845992723, 0.011545740766, 0.523547452874,
    ].forEach((float) => expect(floatGenerator.next().value).toBeCloseTo(float, 12));
  });
});
