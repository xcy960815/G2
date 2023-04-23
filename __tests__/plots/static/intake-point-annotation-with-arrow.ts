import { G2Spec } from '../../../src';
import { intake } from '../../data/intake';

export function intakePointAnnotationWithArrow(): G2Spec {
  return {
    type: 'view',
    children: [
      {
        type: 'point',
        data: intake,
        encode: {
          x: 'x',
          y: 'y',
          color: '#1890ff',
          size: 'z',
          shape: 'point',
        },
        scale: {
          x: { nice: true },
          y: { nice: true, domainMax: 165, zero: true },
          size: { range: [10, 40] },
        },
        legend: { size: false },
        style: {
          stroke: '#1890ff',
          fillOpacity: 0.3,
        },
        labels: [
          {
            text: 'name',
            position: 'inside',
            style: {
              fill: '#1890ff',
              stroke: '#fff',
            },
          },
        ],
      },
      {
        type: 'lineY',
        data: [50],
        style: {
          stroke: '#545454',
          arrow: true,
          arrowStroke: 'red',
          arrowFill: 'red',
        },
        labels: [
          {
            text: 'Safe sugar intake 50g/day',
            position: 'right',
            textBaseline: 'bottom',
          },
        ],
      },
      {
        type: 'lineX',
        data: [65],
        style: {
          stroke: '#545454',
          arrow: true,
        },
        labels: [
          {
            text: 'Safe fat intake 65g/day',
            position: 'top-left',
            style: {
              textBaseline: 'bottom',
            },
          },
        ],
      },
    ],
  };
}
