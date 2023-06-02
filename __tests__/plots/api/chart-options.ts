import { Chart } from '../../../src';

export function chartOptions(context) {
  const { container, canvas } = context;

  const chart = new Chart({
    container,
    canvas,
  });

  chart.options({
    theme: 'classic',
    type: 'line',
    clip: true,
    title: '标题',
    data: {
      type: 'fetch',
      value: 'data/aapl.csv',
    },
    encode: {
      x: 'date',
      y: 'close',
    },
  });

  const finished = chart.render();

  return { chart, finished };
}
