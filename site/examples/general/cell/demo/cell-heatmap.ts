/**
 * A recreation of this demo: https://observablehq.com/@mbostock/the-impact-of-vaccines
 */
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
  width: 1152,
  height: 780,
  paddingLeft: 60,
});

chart
  .data({
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/vaccines.json',
  })
  .axis('y', { labelAutoRotate: false })
  .axis('x', {
    tickFilter: (d) => d % 10 === 0,
    position: 'top',
  })
  .scale('color', {
    type: 'sequential',
    palette: 'puRd',
    relations: [
      [(d) => d === null, '#eee'],
      [0, '#fff'],
    ],
  });

chart
  .cell()
  .encode('x', 'year')
  .encode('y', 'name')
  .encode('color', 'value')
  .style('inset', 0.5)
  .tooltip({ title: { channel: 'color', valueFormatter: '.2f' } });

chart
  .lineX()
  .data([1963])
  .style('stroke', 'black')
  .label({
    text: '1963',
    position: 'bottom',
    style: {
      textBaseline: 'top',
      dy: '0.1em',
      fontSize: 10,
    },
  })
  .label({
    text: 'Measles vaccine introduced',
    position: 'bottom',
    style: {
      textBaseline: 'top',
      fontSize: 10,
      fontWeight: 'bold',
      dy: '0.7em',
    },
  })
  .tooltip(false);

chart.render();
