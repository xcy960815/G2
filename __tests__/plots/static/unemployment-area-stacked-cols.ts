import { G2Spec } from '../../../src';

export function unemploymentAreaStackedCols(): G2Spec {
  return {
    type: 'area',
    padding: 'auto',
    width: 800,
    data: {
      type: 'fetch',
      value: 'data/unemployment-by-industry.csv',
    },
    transform: [{ type: 'stackY' }],
    encode: {
      x: 'date',
      y: 'unemployed',
      color: 'industry',
    },
    legend: {
      color: { cols: 5 },
    },
    viewStyle: {
      viewFill: '#4e79a7',
      plotFill: '#f28e2c',
      mainFill: '#e15759',
      contentFill: '#76b7b2',
    },
  };
}

unemploymentAreaStackedCols.maxError = 180;
