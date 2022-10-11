import { maxIndex } from 'd3-array';
import { Coordinate } from '@antv/coord';
import { Vector2 } from '../../runtime';
import { getArcObject } from '../../shape/utils';
import { isCircular } from '../../utils/coordinate';
import { sub, angle } from '../../utils/vector';

export type LabelPosition =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'inside'
  | 'outside'
  | 'area';

function maybePercentage(x: number | string, size: number) {
  if (x === undefined) return null;
  if (typeof x === 'number') return x;
  const px = +x.replace('%', '');
  return Number.isNaN(px) ? null : (px / 100) * size;
}

function inferNonCircularStyle(
  position: LabelPosition,
  points: Vector2[],
  value: Record<string, any>,
  coordinate: Coordinate,
) {
  const { bounds } = value;
  const [[x0, y0], [x1, y1]] = bounds;
  const w = x1 - x0;
  const h = y1 - y0;
  const xy = (options) => {
    const { x: ox, y: oy } = options;
    const px = maybePercentage(value.x, w);
    const py = maybePercentage(value.y, h);
    return {
      ...options,
      x: (px || ox) + x0,
      y: (py || oy) + y0,
    };
  };
  // 4 direction.
  if (position === 'left')
    return xy({ x: 0, y: h / 2, textAnchor: 'start', textBaseline: 'middle' });
  if (position === 'right')
    return xy({ x: w, y: h / 2, textAnchor: 'end', textBaseline: 'middle' });
  if (position === 'top')
    return xy({ x: w / 2, y: 0, textAnchor: 'center', textBaseline: 'top' });
  if (position === 'bottom')
    return xy({ x: w / 2, y: h, textAnchor: 'center', textBaseline: 'bottom' });
  // 4 corner position.
  if (position === 'top-left')
    return xy({ x: 0, y: 0, textAnchor: 'start', textBaseline: 'top' });
  if (position === 'top-right')
    return xy({ x: w, y: 0, textAnchor: 'end', textBaseline: 'top' });
  if (position === 'bottom-left')
    return xy({ x: 0, y: h, textAnchor: 'start', textBaseline: 'bottom' });
  if (position === 'bottom-right')
    return xy({ x: w, y: h, textAnchor: 'end', textBaseline: 'bottom' });
  if (position === 'inside')
    return xy({
      x: w / 2,
      y: h / 2,
      textAnchor: 'center',
      textBaseline: 'middle',
    });
  return xy({});
}

function inferCircularStyle(
  position: LabelPosition,
  points: Vector2[],
  value: Record<string, any>,
  coordinate: Coordinate,
) {
  // Infer the label position in polar coordinate.
  const { y, y1 } = value;
  const arcObject = getArcObject(coordinate, points, [y, y1]);

  const { startAngle, endAngle, innerRadius, outerRadius } = arcObject;
  const midAngle = (startAngle + endAngle) / 2;

  const center = coordinate.getCenter() as Vector2;

  const offset = position === 'inside' ? 0 : 12;
  const { radius: radiusRatio = 0.5 } = value;
  const radius =
    position === 'inside'
      ? innerRadius + (outerRadius - innerRadius) * radiusRatio
      : outerRadius;
  const finalRadius = radius + offset;

  return {
    x: center[0] + Math.sin(midAngle) * finalRadius,
    y: center[1] - Math.cos(midAngle) * finalRadius,
    textAlign: 'center',
    textBaseline: 'middle',
  };
}

function inferIdentityStyle(position, points, value, coordinate) {
  const { bounds } = value;
  const [p] = bounds;
  return {
    x: p[0],
    y: p[1],
  };
}

function getDefaultStyle(
  position: LabelPosition,
  points: Vector2[],
  value: Record<string, any>,
  coordinate: Coordinate,
) {
  const { bounds } = value;
  // When bounds.length = 1
  // For series mark, such as line and area.
  // The bounds for text is defined with only one point.
  // Use this point as the label position.
  if (bounds.length === 1) {
    return inferIdentityStyle(position, points, value, coordinate);
  }

  const inferDefaultStyle = isCircular(coordinate)
    ? inferCircularStyle
    : inferNonCircularStyle;

  return inferDefaultStyle(position, points, value, coordinate);
}

export const top = getDefaultStyle;
export const bottom = getDefaultStyle;
export const right = getDefaultStyle;
export const left = getDefaultStyle;
export const topLeft = getDefaultStyle;
export const topRight = getDefaultStyle;
export const bottomLeft = getDefaultStyle;
export const bottomRight = getDefaultStyle;
export const inside = getDefaultStyle;
export const outside = getDefaultStyle;

/**
 * Only for Area label.
 */
export function area(
  position: LabelPosition,
  points: Vector2[],
  value: Record<string, any>,
  coordinate: Coordinate,
) {
  const l = points.length / 2;
  const Y1 = points.slice(0, l);
  const Y0 = points.slice(l);
  // Get the maximal space for label.
  let idx = maxIndex(Y1, (p, i) => Math.abs(p[1] - Y0[i][1]));
  // Do not show label at first and last.
  idx = Math.max(Math.min(idx, l - 2), 1);

  const mid = (i: number): Vector2 => [Y1[i][0], (Y1[i][1] + Y0[i][1]) / 2];
  const point = mid(idx);
  const prev = mid(idx - 1);
  const next = mid(idx + 1);

  // todo: G rotate only support deg.
  const rotate = (angle(sub(next, prev)) / Math.PI) * 180;

  return {
    x: point[0],
    y: point[1],
    transform: `rotate(${rotate}deg)`,
    textAlign: 'center',
    textBaseline: 'middle',
  };
}
