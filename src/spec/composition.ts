import { Geometry, Adjust } from './geometry';
import { Theme } from './theme';
import { Coordinate } from './coordinate';
import { Interaction } from './interaction';
import { Transform } from './transform';
import { Scale } from './scale';
import { Title } from './title';

export type Node =
  | MarkComposition
  | ViewComposition
  | LayerComposition
  | FlexComposition
  | MatrixComposition
  | RectComposition
  | CircleComposition
  | KeyframeComposition;

export type MarkComposition = Geometry & {
  title?: Title;
};

export type ViewComposition = {
  type?: 'view';
  data?: any;
  key?: string;
  class?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  coordinate?: Coordinate[];
  interaction?: Interaction[];
  title?: Title;
  theme?: Theme;
  children?: MarkComposition[];
  adjust?: Adjust;
};

export type LayerComposition = {
  type?: 'layer';
  key?: string;
  class?: string;
  data?: any;
  children?: Node[];
};

export type FlexComposition = {
  type?: 'flex';
  key?: string;
  class?: string;
  data?: any;
  direction?: 'col' | 'row';
  flex?: number[];
  padding?: number;
  children?: Node[];
};

export type FacetContext = {
  columnField?: string | number;
  columnIndex?: number;
  columnValue?: string | number;
  columnValuesLength?: number;
  rowField?: string | number;
  rowIndex?: number;
  rowValue?: string | number;
  rowValuesLength?: number;
};

export type RectComposition = {
  transform?: Transform;
  data?: any;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  type?: 'rect';
  title?: Title;
  class?: string;
  encode?: {
    x?: string;
    y?: string;
  };
  scale?: {
    x?: Scale;
    y?: Scale;
  };
  shareData?: boolean;
  shareSize?: boolean;
  children?: Node[] | ((facet: FacetContext) => Node);
};

export type MatrixComposition = {
  type?: 'matrix';
  transform?: Transform;
  data?: any;
  class?: string;
  key?: string;
  encode?: {
    x?: string[];
    y?: string[];
    position?: string[];
  };
  scale?: {
    x?: Scale;
    y?: Scale;
  };
  children?: Node[] | ((facet: FacetContext) => Node);
};

export type CircleComposition = {
  type?: 'matrix';
  transform?: Transform;
  data?: any;
  class?: string;
  key?: string;
  encode?: {
    position?: string;
  };
  scale?: {
    x?: Scale;
    y?: Scale;
  };
  children?: Node[] | ((facet: FacetContext) => Node);
};

export type KeyframeComposition = {
  type?: 'keyframe';
  duration?: number;
  class?: string;
  key?: string;
  easing?: string;
  iterationCount?: 'infinite' | number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'reverse-alternate';
  children?: Node[];
};
