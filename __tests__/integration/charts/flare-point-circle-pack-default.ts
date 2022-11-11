import { G2Spec } from '../../../src';

export async function flarePointCirclePackDefault(): Promise<G2Spec> {
  return {
    padding: 20,
    type: 'pack',
    data: {
      type: 'fetch',
      value: 'data/flare.csv',
    },
    layout: {
      path: (d) => d.name.replace(/\./g, '/'),
    },
  };
}
