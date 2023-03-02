import { Chart } from '@antv/g2';
import { Plugin } from '@antv/g-plugin-rough-canvas-renderer';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Gaegu'],
  },
  active: () => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      plugins: [new Plugin()],
    });

    chart
      .line()
      .data({
        type: 'fetch',
        value:
          'https://gw.alipayobjects.com/os/bmw-prod/cb99c4ab-e0a3-4c76-9586-fe7fa2ff1a8c.csv',
      })
      .transform({ type: 'groupX', y: 'mean' })
      .encode('x', (d) => new Date(d.date).getFullYear())
      .encode('y', 'price')
      .encode('color', 'symbol')
      .label({
        text: 'price',
        transform: [{ type: 'overlapDodgeY' }],
        style: {
          fontSize: 10,
          fontFamily: 'Gaegu',
        },
      })
      .axis('x', { style: { tickStroke: '#cdcdcd', gridStroke: '#efefef' } })
      .axis('y', { style: { tickStroke: '#cdcdcd', gridStroke: '#efefef' } })
      .style('roughness', 2);

    chart.render();
  },
});
