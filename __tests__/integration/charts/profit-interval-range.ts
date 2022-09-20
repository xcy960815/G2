import { G2Spec } from '../../../src';
import { profit } from '../data/profit';

export function profitIntervalRange(): G2Spec {
  return {
    type: 'interval',
    paddingLeft: 60,
    data: profit,
    scale: { y: { formatter: '~s' } },
    encode: {
      x: 'month',
      y: ['end', 'start'],
      color: (d) =>
        d.month === 'Total' ? 'Total' : d.profit > 0 ? 'Increase' : 'Decrease',
    },
  };
}
