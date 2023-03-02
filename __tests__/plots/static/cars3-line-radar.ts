import { G2Spec } from '../../../src';

export function cars3LineRadar(): G2Spec {
  const position = [
    'economy (mpg)',
    'cylinders',
    'displacement (cc)',
    'power (hp)',
    'weight (lb)',
    '0-60 mph (s)',
    'year',
    'economy (mpg)',
  ];
  return {
    type: 'line',
    width: 800,
    data: {
      type: 'fetch',
      value: 'data/cars3.csv',
    },
    coordinate: { type: 'radar' },
    encode: {
      position,
      color: 'weight (lb)',
    },
    style: {
      strokeWidth: 1.5,
      strokeOpacity: 0.4,
    },
    scale: {
      position: { nice: true },
      color: { palette: 'GnBu', offset: (t) => 1 - t },
    },
    legend: {
      color: {
        position: 'bottom',
        labelFormatter: '~s',
      },
    },
    axis: Object.fromEntries(
      Array.from({ length: position.length }, (_, i) => [
        `position${i === 0 ? '' : i}`,
        {
          zIndex: 1,
          style: {
            labelStroke: '#fff',
            labelStrokeWidth: 5,
            labelFontSize: 10,
            labelStrokeLineJoin: 'round',
            titleStroke: '#fff',
            titleFontSize: 10,
            titleStrokeWidth: 5,
            titleStrokeLineJoin: 'round',
            lineStroke: 'black',
            tickStroke: 'black',
            lineStrokeWidth: 1,
          },
        },
      ]),
    ),
  };
}
