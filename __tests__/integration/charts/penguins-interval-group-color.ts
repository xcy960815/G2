import { G2Spec } from '../../../src';

export function penguinsIntervalGroupColor(): G2Spec {
  return {
    type: 'interval',
    data: {
      type: 'fetch',
      value: 'data/penguins.csv',
    },
    height: 120,
    coordinates: [{ type: 'transpose' }],
    transform: [
      { type: 'groupColor', y: 'count' },
      { type: 'stackY' },
      { type: 'normalizeY' },
    ],
    axis: { y: { tickFormatter: '.0%' } },
    encode: {
      color: 'sex',
    },
    labels: [{ text: 'sex', position: 'inside' }],
  };
}
