import { Chart } from '@antv/g2';

const progress = 0.7;

const chart = new Chart({
  container: 'container',
  theme: 'classic',
  width: 100,
  height: 100,
  padding: 8,
});

chart.coordinate({ type: 'theta', innerRadius: 0.7 });

chart
  .interval()
  .data([1, progress])
  .encode('y', (d) => d)
  .encode('color', (d, idx) => idx)
  .scale('y', { domain: [0, 1] })
  .scale('color', { range: ['#000000', '#a0ff03'] })
  .animate('enter', { type: 'waveIn' })
  .axis(false)
  .legend(false);

chart.text().style({
  text: `${progress * 100}%`,
  x: '50%',
  y: '50%',
  textAlign: 'center',
  fontSize: 16,
  fontStyle: 'bold',
});

chart.interaction('tooltip', false);

chart.render();
