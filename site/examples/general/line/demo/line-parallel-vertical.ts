/**
 * A recreation of this demo: https://observablehq.com/@d3/parallel-coordinates
 */
import { Chart } from '@antv/g2';

const axis = {
  zIndex: 1,
  titlePosition: 'right',
  style: {
    labelStroke: '#fff',
    labelStrokeWidth: 5,
    labelFontSize: 10,
    labelStrokeLineJoin: 'round',
    titleStroke: '#fff',
    titleFontSize: 10,
    titleStrokeWidth: 5,
    titleStrokeLineJoin: 'round',
    titleTransform: 'translate(-50%, 0) rotate(-90)',
    lineStroke: 'black',
    tickStroke: 'black',
    lineStrokeWidth: 1,
  },
};

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.coordinate({ type: 'parallel' });

chart
  .line()
  .data({
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/cars3.json',
  })
  .encode('position', [
    'economy (mpg)',
    'cylinders',
    'displacement (cc)',
    'power (hp)',
    'weight (lb)',
    '0-60 mph (s)',
    'year',
  ])
  .encode('color', 'weight (lb)')
  .style('strokeWidth', 1.5)
  .style('strokeOpacity', 0.4)
  .scale('color', {
    type: 'sequential',
    palette: 'brBG',
    offset: (t) => 1 - t,
  })
  .legend({
    color: { length: 400 },
  })
  .axis('position', axis)
  .axis('position1', axis)
  .axis('position2', axis)
  .axis('position3', axis)
  .axis('position4', axis)
  .axis('position5', axis)
  .axis('position6', axis)
  .axis('position7', axis);

chart.render();
