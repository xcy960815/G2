import { G2Spec, render } from '../../../src';
import { createDiv, mount } from '../../utils/dom';

describe('Interactions of tooltip', () => {
  it('render({...} renders line chart with tooltip interaction', () => {
    const chart = render<G2Spec>({
      type: 'view',
      title: 'Line chart with tooltip',
      data: [
        { year: '1991', value: 15468 },
        { year: '1992', value: 16100 },
        { year: '1993', value: 15900 },
        { year: '1994', value: 17409 },
        { year: '1995', value: 17000 },
        { year: '1996', value: 31056 },
        { year: '1997', value: 31982 },
        { year: '1998', value: 32040 },
        { year: '1999', value: 33233 },
      ],
      scale: {
        color: { guide: { title: null } },
      },
      children: [
        {
          type: 'line',
          encode: {
            x: 'year',
            y: 'value',
          },
        },
        {
          type: 'point',
          encode: {
            x: 'year',
            y: 'value',
          },
        },
      ],
      interaction: [
        {
          type: 'tooltip',
          shared: true,
          showCrosshairs: true,
          // showMarkers: true,
          crosshairs: { type: 'xy' },
        },
      ],
    });
    mount(createDiv(), chart);
  });

  it('render({...} renders series line chart with tooltip interaction', () => {
    const chart = render<G2Spec>({
      type: 'line',
      title: 'Line chart with tooltip',
      data: [
        { city: 'London', month: 'Jan.', value: 18.9 },
        { city: 'London', month: 'Feb.', value: 28.8 },
        { city: 'London', month: 'Mar.', value: 39.3 },
        { city: 'London', month: 'Apr.', value: 81.4 },
        { city: 'London', month: 'May', value: 47 },
        { city: 'London', month: 'Jun.', value: 20.3 },
        { city: 'London', month: 'Jul.', value: 24 },
        { city: 'London', month: 'Aug.', value: 35.6 },
        { city: 'Berlin', month: 'Jan.', value: 12.4 },
        { city: 'Berlin', month: 'Feb.', value: 23.2 },
        { city: 'Berlin', month: 'Mar.', value: 34.5 },
        { city: 'Berlin', month: 'Apr.', value: 99.7 },
        { city: 'Berlin', month: 'May', value: 52.6 },
        { city: 'Berlin', month: 'Jun.', value: 35.5 },
        { city: 'Berlin', month: 'Jul.', value: 37.4 },
        { city: 'Berlin', month: 'Aug.', value: 42.4 },
      ],
      encode: {
        x: 'month',
        y: 'value',
        color: 'city',
      },
      scale: {
        color: { guide: { title: null } },
      },
      interaction: [
        {
          type: 'tooltip',
          showCrosshairs: true,
          showMarkers: true,
          shared: true,
        },
      ],
    });
    mount(createDiv(), chart);
  });

  it('render({...} renders line chart in polar coordinate with tooltip interaction', () => {
    const chart = render<G2Spec>({
      type: 'view',
      title: 'Radar chart',
      data: [
        { item: 'Design', user: 'a', score: 70 },
        { item: 'Design', user: 'b', score: 30 },
        { item: 'Development', user: 'a', score: 60 },
        { item: 'Development', user: 'b', score: 70 },
        { item: 'Marketing', user: 'a', score: 50 },
        { item: 'Marketing', user: 'b', score: 60 },
        { item: 'Users', user: 'a', score: 40 },
        { item: 'Users', user: 'b', score: 50 },
        { item: 'Test', user: 'a', score: 60 },
        { item: 'Test', user: 'b', score: 70 },
        { item: 'Language', user: 'a', score: 70 },
        { item: 'Language', user: 'b', score: 50 },
        { item: 'Technology', user: 'a', score: 50 },
        { item: 'Technology', user: 'b', score: 40 },
        { item: 'Support', user: 'a', score: 30 },
        { item: 'Support', user: 'b', score: 40 },
        { item: 'Sales', user: 'a', score: 60 },
        { item: 'Sales', user: 'b', score: 40 },
        { item: 'UX', user: 'a', score: 50 },
        { item: 'UX', user: 'b', score: 60 },
      ],
      coordinate: [{ type: 'polar' }],
      scale: {
        y: { domain: [0, 80], guide: { type: 'axisX' } },
        x: { padding: 0.5, align: 0 },
        color: { guide: { title: null } },
      },
      interaction: [
        {
          type: 'tooltip',
          shared: true,
          showCrosshairs: true,
          crosshairs: { type: 'xy' },
        },
      ],
      children: [
        {
          type: 'line',
          encode: {
            x: 'item',
            y: 'score',
            color: 'user',
          },
        },
        {
          type: 'point',
          encode: {
            x: 'item',
            y: 'score',
            color: 'user',
          },
        },
      ],
    });
    mount(createDiv(), chart);
  });

  it('render({...} renders interval chart with tooltip interaction, in polar coordinate', () => {
    const chart = render<G2Spec>({
      type: 'interval',
      title: 'Interval chart with tooltip',
      data: [
        { genre: 'Sports', sold: 275, type: 'A' },
        { genre: 'Sports', sold: 115, type: 'B' },
        { genre: 'Strategy', sold: 115, type: 'A' },
        { genre: 'Strategy', sold: 95, type: 'B' },
        { genre: 'Action', sold: 120, type: 'A' },
        { genre: 'Action', sold: 190, type: 'B' },
        { genre: 'Shooter', sold: 350, type: 'A' },
        { genre: 'Shooter', sold: 250, type: 'B' },
      ],
      encode: {
        x: 'genre',
        y: 'sold',
        color: 'type',
      },
      scale: {
        color: { guide: { title: null } },
      },
      style: { lineWidth: 1, stroke: '#fff' },
      coordinate: [{ type: 'polar' }],
      interaction: [{ type: 'tooltip', shared: true }],
    });
    mount(createDiv(), chart);
  });

  it('render({...} renders interval chart with tooltip interaction, in polar and transpose coordinate', () => {
    const chart = render<G2Spec>({
      type: 'interval',
      title: 'Interval chart with tooltip',
      data: [
        { genre: 'Sports', sold: 275, type: 'A' },
        { genre: 'Strategy', sold: 115, type: 'A' },
        { genre: 'Action', sold: 120, type: 'A' },
        { genre: 'Shooter', sold: 350, type: 'A' },
      ],
      encode: {
        y: 'sold',
        color: 'genre',
        title: 'genre',
        tooltip: ['genre', 'sold'],
      },
      scale: { color: { guide: { title: null } } },
      coordinate: [{ type: 'transpose' }, { type: 'polar' }],
      style: { lineWidth: 1, stroke: '#fff' },
    });
    mount(createDiv(), chart);
  });

  it('render({...}) should render box chart with tooltip interaction', () => {
    const chart = render<G2Spec>({
      type: 'schema',
      data: [
        { x: 'Oceania', y: [1, 9, 16, 22, 24] },
        { x: 'East Europe', y: [1, 5, 8, 12, 16] },
        { x: 'Australia', y: [1, 8, 12, 19, 26] },
        { x: 'South America', y: [2, 8, 12, 21, 28] },
        { x: 'North Africa', y: [1, 8, 14, 18, 24] },
        { x: 'North America', y: [3, 10, 17, 28, 30] },
        { x: 'West Europe', y: [1, 7, 10, 17, 22] },
        { x: 'West Africa', y: [1, 6, 8, 13, 16] },
      ],
      encode: {
        x: 'x',
        y: 'y',
      },
      scale: {
        x: { paddingInner: 0.6, paddingOuter: 0.3 },
        y: { zero: true, title: 'value' },
      },
      style: { stroke: 'black' },
      interaction: [{ type: 'tooltip', shared: true }],
    });

    mount(createDiv(), chart);
  });

  it('render({...}) should render interval with tooltip interaction in transpose coordinate', () => {
    const chart = render<G2Spec>({
      type: 'interval',
      data: [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115 },
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150 },
      ],
      coordinate: [{ type: 'transpose' }],
      encode: {
        x: 'genre',
        y: 'sold',
        color: 'genre',
      },
    });
    mount(createDiv(), chart);
  });

  it('render({...}) should render interval with tooltip interaction with `shared: true` in transpose coordinate', () => {
    const chart = render<G2Spec>({
      type: 'interval',
      title: 'Tooltip shared',
      data: [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115 },
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150 },
      ],
      coordinate: [{ type: 'transpose' }],
      encode: {
        x: 'genre',
        y: 'sold',
        color: 'genre',
      },
      interaction: [{ type: 'tooltip', shared: true }],
    });
    mount(createDiv(), chart);
  });
});
