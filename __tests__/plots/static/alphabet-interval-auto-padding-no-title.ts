import { G2Spec } from '../../../src';

export function alphabetIntervalAutoPaddingNoTitle(): G2Spec {
  return {
    type: 'interval',
    padding: 'auto',
    transform: [{ type: 'sortX', by: 'y', reverse: true }],
    data: {
      type: 'fetch',
      value: 'data/alphabet.csv',
    },
    encode: {
      x: 'letter',
      y: 'frequency',
      color: 'steelblue',
    },
    axis: {
      y: { title: false },
      x: { title: false },
    },
    viewStyle: {
      viewFill: '#4e79a7',
      plotFill: '#f28e2c',
      mainFill: '#e15759',
      contentFill: '#76b7b2',
    },
  };
}
