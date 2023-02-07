import { G2Spec } from '../../../src';

export function aaplLineScrollbar(): G2Spec {
  return {
    type: 'line',
    paddingLeft: 80,
    data: {
      type: 'fetch',
      value: 'data/aapl.csv',
    },
    encode: {
      x: (d) => new Date(d.date),
      y: 'close',
    },
    axis: {
      x: { title: false, size: 28 },
      y: { title: false, size: 36 },
    },
    scrollbar: {
      x: {},
      y: {},
    },
  };
}

aaplLineScrollbar.maxError = 100;
