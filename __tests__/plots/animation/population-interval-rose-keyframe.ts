import { G2Spec } from '../../../src';

export async function populationIntervalRoseKeyframe(): Promise<G2Spec> {
  return {
    type: 'timingKeyframe',
    width: 400,
    height: 400,
    children: [
      {
        type: 'interval',
        data: {
          type: 'fetch',
          value: 'data/population.csv',
        },
        coordinates: [
          { type: 'polar', outerRadius: 0.85, startAngle: -Math.PI / 2 },
        ],
        transform: [{ type: 'groupX', y: 'sum' }],
        animate: { enterType: 'waveIn' },
        scale: { y: { type: 'sqrt' } },
        encode: { x: 'year', y: 'people' },
        axis: {
          y: {
            labelFormatter: '~s',
            tickCount: 5,
            tickFilter: (d, i) => i !== 0,
            direction: 'right',
          },
        },
      },
      {
        type: 'interval',
        data: {
          type: 'fetch',
          value: 'data/population.csv',
        },
        coordinates: [{ type: 'polar', outerRadius: 0.85, startAngle: 0 }],
        transform: [{ type: 'groupX', y: 'sum' }],
        animate: { enterType: 'waveIn' },
        scale: { y: { type: 'sqrt' } },
        encode: { x: 'year', y: 'people' },
        axis: {
          y: {
            labelTransform: 'rotate(45)',
            labelFormatter: '~s',
            tickCount: 5,
            tickFilter: (d, i) => i !== 0,
            direction: 'right',
          },
        },
      },
    ],
  };
}

populationIntervalRoseKeyframe.intervals = [false, false, [333, 666]];
