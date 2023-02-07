import { randomUniform, randomLcg } from 'd3-random';
import { G2Spec } from '../../../src';

export function philosophyWordCloudDefault(): G2Spec {
  const random = randomUniform.source(randomLcg(42))(0, 1);
  return {
    type: 'wordCloud',
    data: {
      type: 'fetch',
      value: 'data/philosophyWord.json',
    },
    layout: {
      random,
      rotate: 0,
    },
  };
}
