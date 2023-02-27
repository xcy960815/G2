import { G2Spec } from '../../../src';

export function population2015IntervalWaveInRadius(): G2Spec {
  return {
    type: 'view',
    height: 640,
    data: {
      type: 'fetch',
      value: 'data/population2015.csv',
    },
    children: [
      {
        type: 'interval',
        transform: [{ type: 'stackY' }],
        coordinate: { type: 'theta', innerRadius: 0.6 },
        scale: {
          color: {
            palette: 'spectral',
            offset: (t) => t * 0.8 + 0.1,
          },
        },
        legend: false,
        encode: {
          y: 'value',
          color: 'name',
        },
        style: {
          stroke: 'white',
          inset: 1,
          radius: 10,
        },
        animate: {
          enter: { type: 'waveIn' },
        },
      },
    ],
  };
}

population2015IntervalWaveInRadius.intervals = [[]];

population2015IntervalWaveInRadius.only = true;
