import { G2Spec } from '../../../src';

export function marketIntervalMarimekko(): G2Spec {
  return {
    type: 'interval',
    width: 900,
    height: 800,
    paddingLeft: 0,
    paddingRight: 0,
    data: {
      type: 'fetch',
      value: 'data/market.csv',
    },
    transform: [
      { type: 'flexX', reducer: 'sum' },
      { type: 'stackY' },
      { type: 'normalizeY' },
    ],
    scale: {
      y: { guide: null },
      x: { paddingOuter: 0, paddingInner: 0.01 },
    },
    encode: {
      x: 'market',
      y: 'value',
      color: 'segment',
    },
    labels: [
      {
        text: 'segment',
        x: 5,
        y: 5,
        textAnchor: 'start',
        textBaseline: 'top',
        fontSize: 10,
        fill: '#fff',
      },
      {
        text: 'value',
        x: 5,
        y: 5,
        textAnchor: 'start',
        textBaseline: 'bottom',
        dy: '1.5em',
        fontSize: 10,
        fill: '#fff',
      },
    ],
  };
}
