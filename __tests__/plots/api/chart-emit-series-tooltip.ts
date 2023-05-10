import { Chart } from '../../../src';

export function chartEmitSeriesTooltip(context) {
  const { container, canvas } = context;

  // wrapperDiv
  const wrapperDiv = document.createElement('div');
  container.appendChild(wrapperDiv);

  // button
  const button = document.createElement('button');
  button.innerText = 'Hide tooltip';
  container.appendChild(button);

  // p
  const p = document.createElement('p');
  p.innerText = '';
  container.appendChild(p);

  const chart = new Chart({
    theme: 'classic',
    container: wrapperDiv,
    canvas,
  });

  chart.options({
    type: 'line',
    data: { type: 'fetch', value: 'data/aapl.csv' },
    encode: { x: 'date', y: 'close' },
    tooltip: { title: (d) => new Date(d.date).toUTCString() },
  });

  const finished = chart.render();

  finished.then((chart) =>
    chart.emit('tooltip:show', {
      data: { data: { x: new Date('2010-11-16') } },
    }),
  );

  chart.on('tooltip:show', ({ data }) => {
    p.innerText = JSON.stringify(data);
  });

  const hide = () => {
    console.log('hide');
  };
  chart.on('tooltip:hide', hide);

  button.onclick = () => {
    chart.emit('tooltip:hide');
  };

  return {
    chart,
    button,
    finished,
    clear: () => {
      chart.off('tooltip:hide', hide);
    },
  };
}
