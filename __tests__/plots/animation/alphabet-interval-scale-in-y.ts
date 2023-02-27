import { G2Spec } from '../../../src';

export function alphabetIntervalScaleInY(): G2Spec {
  return {
    type: 'interval',
    transform: [{ type: 'sortX', by: 'y', reverse: true }],
    data: {
      type: 'fetch',
      value: 'data/alphabet.csv',
    },
    axis: {
      y: { labelFormatter: '.0%' },
    },
    encode: {
      x: 'letter',
      y: 'frequency',
      color: 'steelblue',
    },
    animate: {
      enter: {
        duration: 1000,
      },
    },
  };
}

alphabetIntervalScaleInY.intervals = [[500]];
