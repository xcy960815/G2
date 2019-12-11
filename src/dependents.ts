/* 依赖的模块，在这里统一引入，方便打包优化 */

// G
export { ICanvas, IElement, IGroup, IShape } from '@antv/g-base/lib/interfaces';
export { PathCommand, BBox } from '@antv/g-base/lib/types';
export { Event } from '@antv/g-base';
// 需要有 G-base 提供 g engine 类型定义
export type IG = any;

// adjust
export { registerAdjust, getAdjust, Adjust } from '@antv/adjust/lib/factory';

// attr
export { getAttribute, Attribute, colorUtil } from '@antv/attr/lib/factory';

// coordinate
export { getCoordinate, registerCoordinate, Coordinate, CoordinateCfg } from '@antv/coord';

// scale
export { getScale, registerScale, Scale, ScaleConfig } from '@antv/scale';
export { Tick } from '@antv/scale/lib/base';

// component
import { Annotation, Axis, Component, Grid, GroupComponent, Legend, Tooltip } from '@antv/component';
export { IComponent } from '@antv/component/lib/interfaces';
export { CategoryLegendCfg, CircleAxisCfg, LineAxisCfg, GroupComponentCfg } from '@antv/component/lib/types';
export { GroupComponent, Component };
export { Annotation };
// axis
const { Line: LineAxis, Circle: CircleAxis } = Axis;
export { LineAxis, CircleAxis };
// grid
const { Line: LineGrid, Circle: CircleGrid } = Grid;
export { LineGrid, CircleGrid };
// legend
const { Category: CategoryLegend, Continuous: ContinuousLegend } = Legend;
export { CategoryLegend, ContinuousLegend };
// Tooltip
const { Html: HtmlTooltip } = Tooltip;
export { HtmlTooltip };
