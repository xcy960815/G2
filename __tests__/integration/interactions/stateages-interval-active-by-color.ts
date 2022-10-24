import { G2Spec, ELEMENT_CLASS_NAME } from '../../../src';
import { step } from './utils';

export function stateAgesIntervalActiveByColor(): G2Spec {
  return {
    type: 'interval',
    padding: 0,
    axis: false,
    legend: false,
    width: 800,
    transform: [
      { type: 'stackY' },
      { type: 'sortX', by: 'y', reverse: true, slice: 5 },
    ],
    data: {
      type: 'fetch',
      value: 'data/stateages.csv',
      format: 'csv',
    },
    encode: {
      x: 'state',
      y: 'population',
      color: 'age',
    },
    scale: {
      x: { paddingInner: 0.2 },
    },
    interaction: [
      {
        type: 'elementActiveByColor',
        activeFill: 'red',
        inactiveOpacity: 0.6,
      },
    ],
  };
}

stateAgesIntervalActiveByColor.steps = ({ canvas }) => {
  const { document } = canvas;
  const elements = document.getElementsByClassName(ELEMENT_CLASS_NAME);
  const [e1] = elements;
  return [step(e1, 'pointerover')];
};
