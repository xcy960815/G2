import { G2Spec } from '../../../src';

export function cars3LineParallelVertical(): G2Spec {
  const position = [
    'economy (mpg)',
    'cylinders',
    'displacement (cc)',
    'power (hp)',
    'weight (lb)',
    '0-60 mph (s)',
    'year',
  ];
  return {
    type: 'line',
    height: 800,
    data: {
      type: 'fetch',
      value: 'data/cars3.csv',
    },
    interaction: { tooltip: { series: false } },
    coordinate: { type: 'parallel', transform: [{ type: 'transpose' }] },
    encode: {
      position,
      color: 'cylinders',
    },
    style: {
      strokeWidth: 1.5,
      strokeOpacity: 0.4,
    },
    layout: { padding: 5 },
    scale: {
      color: {
        palette: 'brBG',
        offset: (t) => 1 - t,
      },
    },
    legend: {
      color: {
        position: 'top',
        layout: { justifyContent: 'center' },
        size: 50,
        length: 300,
        style: {
          labelSpacing: 0,
        },
      },
    },
    axis: Object.fromEntries(
      Array.from({ length: position.length }, (_, i) => [
        `position${i === 0 ? '' : i}`,
        {
          zIndex: 1,
          line: true,
          tick: true,
          style: {
            labelFontSize: 10,
            labelStroke: '#fff',
            labelStrokeLineJoin: 'round',
            labelStrokeWidth: 5,
            lineStroke: 'black',
            lineStrokeOpacity: 1,
            lineStrokeWidth: 1,
            tickStroke: 'black',
            titleFontSize: 10,
            titleStroke: '#fff',
            titleStrokeLineJoin: 'round',
            titleStrokeWidth: 5,
          },
        },
      ]),
    ),
  };
}
