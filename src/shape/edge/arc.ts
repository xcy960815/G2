import { Path } from '@antv/g';
import { path as d3path } from 'd3-path';
import { appendArc, applyStyle } from '../utils';
import { select } from '../../utils/selection';
import { isPolar } from '../../utils/coordinate';
import { angle, dist, mid, sub } from '../../utils/vector';
import { ShapeComponent as SC } from '../../runtime';

export type ArcOptions = Record<string, any>;

/**
 * Connect points for 2 points:
 * - In rect, draw half circle.
 * - In polar, draw quadratic curve.
 */
export const Arc: SC<ArcOptions> = (options) => {
  const { ...style } = options;
  return (points, value, coordinate, theme) => {
    const { defaultColor } = theme;
    const { color = defaultColor, transform } = value;
    const [from, to] = points;

    const path = d3path();
    path.moveTo(from[0], from[1]);

    if (isPolar(coordinate)) {
      const center = coordinate.getCenter();
      path.quadraticCurveTo(center[0], center[1], to[0], to[1]);
    } else {
      const center = mid(from, to);
      const raduis = dist(from, to) / 2;
      appendArc(path, from, to, center, raduis);
    }

    return select(new Path())
      .style('d', path.toString())
      .style('stroke', color)
      .style('transform', transform)
      .call(applyStyle, style)
      .node();
  };
};

Arc.props = {
  defaultEnterAnimation: 'fadeIn',
};
