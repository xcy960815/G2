import { G2Spec } from '../../../src';

export function population2015IntervalDonutLabel(): G2Spec {
  return {
    type: 'interval',
    height: 640,
    data: {
      type: 'fetch',
      value: 'data/population2015.csv',
    },
    transform: [{ type: 'stackY' }],
    coordinates: [{ type: 'theta', innerRadius: 0.6 }],
    scale: {
      color: {
        palette: 'spectral',
        offset: (t) => t * 0.8 + 0.1,
      },
    },
    legend: false,
    encode: {
      y: 'value',
      color: 'name',
    },
    style: {
      stroke: 'white',
      lineWidth: 1,
    },
    labels: [
      {
        text: 'name',
        fontSize: 10,
        fill: '#000',
        autoRotate: true,
      },
      {
        text: 'value',
        fontSize: 10,
        textAlign: 'center',
        textBaseline: 'bottom',
        autoRotate: true,
        rotateToAlignArc: true,
        connector: false,
        offset: 4,
        position: 'outside',
        transform: [{ type: 'hideOverlap' }],
      },
    ],
  };
}
