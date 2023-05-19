import { G2Spec } from '../../../src';

export function peoplePointStackedAutoPaddingNumberLabel(): G2Spec {
  return {
    type: 'view',
    height: 360,
    padding: 'auto',
    style: {
      viewFill: '#4e79a7',
      plotFill: '#f28e2c',
      mainFill: '#e15759',
      contentFill: '#76b7b2',
    },
    children: [
      {
        type: 'point',
        data: {
          type: 'fetch',
          value: 'data/people.csv',
        },
        transform: [{ type: 'stackY', y1: 'y' }],
        scale: {
          x: { nice: true },
        },
        axis: {
          y: {
            title: '← Women · Men →',
            labelFormatter: Math.abs,
          },
          x: {
            title: 'Age →',
            titlePosition: 'left-bottom',
            titleTransform: 'translate(100%, 0)',
          },
        },
        encode: {
          x: (d) => 2021 - d.birth,
          y: (d) => (d.gender === 'M' ? 1 : -1),
          color: 'gender',
          shape: 'point',
        },
      },
      {
        type: 'lineY',
        data: [0],
        style: {
          stroke: 'black',
        },
      },
    ],
  };
}
