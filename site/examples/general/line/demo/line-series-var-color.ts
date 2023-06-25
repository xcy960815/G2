import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
  autoFit: true,
});

chart
  .line()
  .data({
    type: 'fetch',
    value:
      'https://gw.alipayobjects.com/os/bmw-prod/cb99c4ab-e0a3-4c76-9586-fe7fa2ff1a8c.csv',
  })
  .encode('x', (d) => new Date(d.date))
  .encode('y', 'price')
  .encode('series', 'symbol')
  .encode('color', 'price')
  .style('gradient', 'y')
  .style('shape', 'smooth')
  .style('strokeWidth', 10);

chart.render();
