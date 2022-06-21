import { G2Context, G2Spec, render } from '../../../src';
import { createDiv, mount } from '../../utils/dom';

describe('Interactions of ElementHighlight', () => {
  it('render({...} renders chart with elementHighlight interaction', () => {
    const context: G2Context = {};
    const chart = render<G2Spec>(
      {
        type: 'view',
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
        title: 'ElementHighlight',
        scale: {
          x: { flex: [1, 2, 3, 4] },
        },
        children: [
          {
            type: 'interval',
            encode: {
              x: 'genre',
              y: 'sold',
              color: 'type',
            },
            scale: {
              color: { guide: { title: null } },
            },
          },
        ],
        interaction: [{ type: 'elementHighlight' }],
      },
      context,
    );
    mount(createDiv(), chart);
  });

  it('render({...} renders chart with elementHighlightByColor interaction', () => {
    const context: G2Context = {};
    const chart = render<G2Spec>(
      {
        type: 'view',
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
        title: 'ElementHighlightByColor',
        scale: {
          x: { flex: [1, 2, 3, 4] },
        },
        children: [
          {
            type: 'interval',
            encode: {
              x: 'genre',
              y: 'sold',
              color: 'type',
            },
            scale: {
              color: { guide: { title: null } },
            },
          },
        ],
        interaction: [{ type: 'elementHighlightByColor' }],
      },
      context,
    );
    mount(createDiv(), chart);
  });

  it('render({...} renders chart with elementHighlightByX interaction', () => {
    const context: G2Context = {};
    const chart = render<G2Spec>(
      {
        type: 'view',
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
        title: 'ElementHighlightByX',
        scale: {
          x: { flex: [1, 2, 3, 4] },
        },
        children: [
          {
            type: 'interval',
            encode: {
              x: 'genre',
              y: 'sold',
              color: 'type',
            },
            scale: {
              color: { guide: { title: null } },
            },
          },
        ],
        interaction: [{ type: 'elementHighlightByX' }],
      },
      context,
    );
    mount(createDiv(), chart);
  });
});
