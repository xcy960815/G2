import { Chart } from '../../../src';
import { temperatures } from '../../data/temperatures';

export function chartOnSeriesElement(context) {
  const { container, canvas } = context;

  const chart = new Chart({ theme: 'classic', container, canvas });

  chart.data(temperatures);

  chart
    .line()
    .encode('x', 'month')
    .encode('y', 'temperature')
    .encode('color', 'city')
    .style('strokeWidth', 10);

  chart.on('line:click', (e) => {
    console.log(e.data.data);
  });

  chart.on('element:click', (e) => {
    console.log(e.data.data);
  });

  const finished = chart.render();

  return { chart, finished };
}
