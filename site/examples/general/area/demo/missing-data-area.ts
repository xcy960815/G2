import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.data({
  type: 'fetch',
  value: 'https://assets.antv.antgroup.com/g2/aapl.json',
});

chart
  .area()
  .encode('x', (d) => new Date(d.date))
  // Mock missing data. Set NaN from Jan. to Mar.
  .encode('y', (d) => (new Date(d.date).getUTCMonth() <= 3 ? NaN : d.close))
  .style('connectNulls', true)
  .style('connectFill', 'grey')
  .style('connectFillOpacity', 0.15);

chart.render();
