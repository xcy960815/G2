import { G2Spec } from '../../../src';

export function bodyPointScatterPlot(): G2Spec {
  return {
    type: 'point',
    padding: 'auto',
    data: {
      type: 'fetch',
      value: 'data/body.json',
    },
    encode: {
      x: 'height',
      y: 'weight',
      size: 'weight',
      color: 'red',
    },
    legend: {
      color: {
        size: 40,
      },
    },
  };
}

bodyPointScatterPlot.maxError = 100;
