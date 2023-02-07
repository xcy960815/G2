import { G2Spec } from '../../../src';

export function stateAgesIntervalStacked(): G2Spec {
  return {
    type: 'interval',
    paddingLeft: 50,
    width: 800,
    transform: [{ type: 'stackY' }, { type: 'sortX', by: 'y', reverse: true }],
    data: {
      type: 'fetch',
      value: 'data/stateages.csv',
      format: 'csv',
    },
    axis: {
      x: { labelTransform: 'rotate(90deg)' },
      y: { labelFormatter: '~s' },
    },
    encode: {
      x: 'state',
      y: 'population',
      color: 'age',
    },
  };
}
