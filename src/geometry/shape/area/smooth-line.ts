import { IGroup } from '../../../dependents';
import { ShapeInfo } from '../../../interface';
import { ShapeMarkerCfg } from '../interface';

import { registerShape } from '../base';
import { getConstraint, getShapeAttrs } from './util';

/** 描边的平滑曲面图 */
registerShape('area', 'smooth-line', {
  draw(cfg: ShapeInfo, container: IGroup) {
    const coordinate = this.coordinate;
    const attrs = getShapeAttrs(cfg, true, true, this, getConstraint(coordinate));
    const shape = container.addShape({
      type: 'path',
      attrs,
      name: 'area',
    });

    return shape;
  },
  getMarker(markerCfg: ShapeMarkerCfg) {
    const { color } = markerCfg;
    return {
      symbol: (x: number, y: number, r: number = 5.5) => {
        return [['M', x - r, y - 4], ['L', x + r, y - 4], ['L', x + r, y + 4], ['L', x - r, y + 4], ['Z']];
      },
      style: {
        r: 5,
        stroke: color,
        fill: null,
      },
    };
  },
});
