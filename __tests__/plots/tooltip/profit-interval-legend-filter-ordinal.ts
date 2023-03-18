import { CustomEvent } from '@antv/g';
import { G2Spec, ELEMENT_CLASS_NAME } from '../../../src';
import { LEGEND_ITEMS_CLASS_NAME } from '../../../src/interaction/legendFilter';
import { profit } from '../../data/profit';

export function profitIntervalLegendFilterOrdinal(): G2Spec {
  return {
    paddingLeft: 60,
    type: 'interval',
    data: profit,
    axis: { x: { animate: false }, y: { labelFormatter: '~s' } },
    legend: {
      color: {
        state: { unselected: { labelOpacity: 0.5, markerOpacity: 0.5 } },
      },
    },
    encode: {
      x: 'month',
      y: ['end', 'start'],
      color: (d) =>
        d.month === 'Total' ? 'Total' : d.profit > 0 ? 'Increase' : 'Decrease',
    },
  };
}

profitIntervalLegendFilterOrdinal.steps = ({ canvas }) => {
  const { document } = canvas;
  const items = document.getElementsByClassName(LEGEND_ITEMS_CLASS_NAME);
  const [i0] = items;
  return [
    {
      skip: true,
      changeState: async () => {
        i0.dispatchEvent(new CustomEvent('click'));
      },
    },
    {
      changeState: async () => {
        const elements = document.getElementsByClassName(ELEMENT_CLASS_NAME);
        const [e0] = elements;
        e0.dispatchEvent(new CustomEvent('pointerover'));
      },
    },
  ];
};
