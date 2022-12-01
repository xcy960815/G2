import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  paddingLeft: 80,
  height: 180,
});

chart.data({
  type: 'fetch',
  value: 'https://assets.antv.antgroup.com/g2/penguins.json',
  transform: [
    {
      type: 'map',
      callback: (d) => ({ ...d, body_mass_g: +d.body_mass_g }),
    },
  ],
});

chart
  .point()
  .encode('x', 'body_mass_g')
  .encode('y', 'species')
  .style('stroke', '#000');

chart
  .link()
  .transform({ type: 'groupY', x: 'min', x1: 'max' })
  .encode('x', 'body_mass_g')
  .encode('y', 'species')
  .style('stroke', '#000');

chart
  .point()
  .transform({ type: 'groupY', x: 'median' })
  .encode('y', 'species')
  .encode('x', 'body_mass_g')
  .encode('shape', 'line')
  .encode('size', 12)
  .style('stroke', 'red');

chart.render();
