/**
 * A recreation of this demo: https://observablehq.com/@observablehq/plot-link?collection=@observablehq/plot
 */
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart
  .link()
  .data({
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antfincdn/SM13%24lHuYH/metros.json',
  })
  .encode('x', ['POP_1980', 'POP_2015'])
  .encode('y', ['R90_10_1980', 'R90_10_2015'])
  .encode('color', (d) => d.R90_10_2015 - d.R90_10_1980)
  .scale('x', { type: 'log' })
  .style('arrowSize', 6)
  .axis('x', {
    labelFormatter: '~s',
    style: { labelTransform: 'rotate(90deg)' },
  })
  .legend(false);

chart.render();
