import { ShapeComponent as SC } from '../../runtime';
import { Color } from './color';

export type TriangleDownOptions = Record<string, any>;

/**
 * ▼
 */
export const TriangleDown: SC<TriangleDownOptions> = (options) => {
  return Color({
    colorAttribute: 'fill',
    symbol: 'triangle-down',
    ...options,
  });
};

TriangleDown.props = {
  defaultMarker: 'triangleDown',
  ...Color.props,
};
