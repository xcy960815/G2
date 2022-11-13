import { G2Spec } from '../../../src';

export function titanicPointPackSharedSize(): G2Spec {
  return {
    type: 'facetRect',
    paddingRight: 50,
    data: {
      type: 'fetch',
      value: 'data/titanic.csv',
      transform: [
        {
          type: 'sortBy',
          fields: ['survived'],
        },
        {
          type: 'map',
          callback: ({ survived, ...d }) => ({
            ...d,
            survived: survived + '',
          }),
        },
      ],
    },
    shareSize: true,
    encode: {
      x: 'pclass',
    },
    children: [
      {
        type: 'point',
        transform: [{ type: 'pack' }],
        legend: {
          color: { tickFormatter: (d) => (d === '1' ? 'Yes' : 'No') },
        },
        encode: {
          color: 'survived',
          shape: 'point',
        },
      },
    ],
  };
}
