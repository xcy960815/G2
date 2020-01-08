import { each } from '@antv/util';
import { Point } from "../../../interface";

export function getCPath(from: Point, to: Point) {
  const points = [];
  points.push({
    x: from.x,
    y: from.y * 1 / 2 + to.y * 1 / 2,
  });

  points.push({
    x: to.x,
    y: from.y * 1 / 2 + to.y * 1 / 2,
  });
  points.push(to);

  const sub = ['C'];
  each(points, point => {
    sub.push(point.x, point.y);
  });

  return sub;
}

export function getQPath(to: Point, center: Point) {
  const points = [];
  points.push({
    x: center.x,
    y: center.y
  });
  points.push(to);

  const sub = ['Q'];
  each(points, point => {
    sub.push(point.x, point.y);
  });

  return sub;
}
