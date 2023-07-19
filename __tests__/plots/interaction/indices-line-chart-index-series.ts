import { csv } from 'd3-fetch';
import { autoType } from 'd3-dsv';
import { G2Spec, ELEMENT_CLASS_NAME } from '../../../src';
import { step } from './utils';

export async function indicesLineChartIndexSeries(): Promise<G2Spec> {
  const data = await csv('data/indices.csv', autoType);
  return {
    type: 'line',
    width: 800,
    paddingLeft: 50,
    data,
    scale: {
      y: { type: 'log' },
    },
    axis: {
      y: { labelAutoRotate: false },
    },
    legend: false,
    encode: {
      x: 'Date',
      y: 'Close',
      color: 'Symbol',
      key: 'Symbol',
    },
    labels: [
      {
        text: 'Symbol',
        selector: 'last',
        fontSize: 10,
      },
    ],
    interaction: {
      chartIndex: {
        ruleStroke: '#aaa',
        labelDx: 5,
        labelTextAlign: 'center',
        labelStroke: '#fff',
        labelLineWidth: 5,
        labelTextBaseline: 'middle',
        labelFormatter: (d) => `${d.toUTCString()}`,
      },
    },
  };
}

indicesLineChartIndexSeries.steps = ({ canvas }) => {
  const { document } = canvas;
  const elements = document.getElementsByClassName(ELEMENT_CLASS_NAME);
  const [e] = elements;
  return [
    step(e, 'pointermove', {
      offsetX: 450,
      offsetY: 350,
    }),
  ];
};

indicesLineChartIndexSeries.maxError = 300;
