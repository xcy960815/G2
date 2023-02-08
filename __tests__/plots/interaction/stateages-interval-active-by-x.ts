import { G2Spec, ELEMENT_CLASS_NAME } from '../../../src';
import { step } from './utils';

export function stateAgesIntervalActiveByX(): G2Spec {
  return {
    type: 'interval',
    padding: 0,
    transform: [
      { type: 'sortX', by: 'y', reverse: true, reducer: 'sum', slice: 6 },
      { type: 'dodgeX' },
    ],
    data: {
      type: 'fetch',
      value: 'data/stateages.csv',
    },
    axis: false,
    legend: false,
    encode: {
      x: 'state',
      y: 'population',
      color: 'age',
    },
    interaction: {
      elementHighlightByX: {
        highlightedFill: 'red',
        unhighlightedOpacity: 0.6,
      },
    },
  };
}

stateAgesIntervalActiveByX.steps = ({ canvas }) => {
  const { document } = canvas;
  const elements = document.getElementsByClassName(ELEMENT_CLASS_NAME);
  const [e1] = elements;
  return [step(e1, 'pointerover')];
};
