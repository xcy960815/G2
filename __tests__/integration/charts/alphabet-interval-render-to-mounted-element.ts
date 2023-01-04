import { G2Spec } from '../../../src';

export function alphabetIntervalRenderToMountedGroup(): G2Spec {
  return {
    type: 'interval',
    paddingLeft: 60,
    data: {
      type: 'fetch',
      value: 'data/alphabet.csv',
    },
    encode: {
      x: 'letter',
      y: 'frequency',
    },
  };
}

alphabetIntervalRenderToMountedGroup.mounted = true;
