import { G2Spec } from '../../../src';

export function temperatureCompareAreaDifference(): G2Spec {
  return {
    width: 800,
    type: 'view',
    data: {
      type: 'fetch',
      value: 'data/temperature-compare.csv',
    },
    children: [
      {
        type: 'area',
        data: {
          transform: [
            {
              type: 'fold',
              fields: ['New York', 'San Francisco'],
              as: ['city', 'temperature'],
            },
          ],
        },
        transform: [{ type: 'diffY' }],
        encode: {
          x: 'date',
          y: 'temperature',
          color: 'city',
          shape: 'step',
        },
        scale: {
          color: { range: ['#67a9cf', '#ef8a62'] },
        },
      },
      {
        type: 'line',
        encode: {
          x: 'date',
          y: 'San Francisco',
          shape: 'hvh',
        },
        style: {
          stroke: '#000',
        },
      },
    ],
  };
}

temperatureCompareAreaDifference.maxError = 1280;
