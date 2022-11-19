// @ts-nocheck
import { ActionComponent } from '../interaction';
import { FisheyeCoordinate } from './coordinate';

export type Action =
  | FisheyeFocusAction
  | CustomAction
  | SurfacePointSelectionAction
  | ActiveElementAction
  | HighlightElementAction
  | FilterElementAction
  | TriggerInfoSelectionAction
  | LegendItemSelectionAction
  | SetItemStateAction
  | PlotAction
  | FilterAction
  | CursorAction
  | TooltipAction
  | RecordTipAction
  | PoptipAction
  | RecordPointAction
  | RecordCurrentPointAction
  | RecordStateAction
  | RecordRegionAction
  | MaskAction
  | ButtonAction
  | MoveAction
  | ActiveRegionAction;

export type ActionTypes =
  | 'fisheyeFocus'
  | 'surfacePointSelection'
  | 'elementSelection'
  | 'activeElement'
  | 'highlightElement'
  | 'filterElement'
  | 'triggerInfoSelection'
  | 'legendItemSelection'
  | 'setItemState'
  | 'plot'
  | 'filter'
  | 'cursor'
  | 'tooltip'
  | 'recordTip'
  | 'poptip'
  | 'recordState'
  | 'recordPoint'
  | 'recordCurrentPoint'
  | 'recordRegion'
  | 'mask'
  | 'button'
  | 'move'
  | 'activeRegion'
  | CustomAction;

export type FisheyeFocusAction = {
  type?: 'fisheyeFocus';
} & Omit<FisheyeCoordinate, 'type'>;

export type SurfacePointSelectionAction = {
  type?: 'surfacePointSelection';
};

export type ActiveElementAction = {
  type?: 'activeElement';
  color?: string;
  border?: number;
};

export type HighlightElementAction = {
  type?: 'highlightElement';
  color?: string;
  clear?: boolean;
};

export type FilterElementAction = {
  type?: 'filterElement';
};

export type CursorAction = {
  type?: 'cursor';
  cursor?: string;
};

export type PlotAction = {
  type?: 'plot';
};

export type FilterAction = {
  type?: 'filter';
  reset?: boolean;
};

export type TooltipAction = {
  type?: 'tooltip';
  showMarkers?: boolean;
  showCrosshairs?: boolean;
  crosshairs?: any;
  markers?: any;
};

export type ElementSelectionAction = {
  type?: 'elementSelection';
  trigger?: 'item' | 'axis' | 'triggerInfo' | 'rect-mask' | 'polygon-mask';
  filter?: 'x' | 'color';
  toggle?: boolean;
  multiple?: boolean;
};

export type TriggerInfoSelectionAction = {
  type?: 'triggerInfoSelection';
  multiple?: boolean;
};

export type LegendItemSelectionAction = {
  type?: 'legendItemSelection';
  from?: 'selectedElements' | 'triggerInfo';
};

export type SetItemStateAction = {
  type?: 'setItemState';
  color?: string;
  items?: string[];
  state?: string;
};

export type RecordStateAction = {
  type?: 'recordState';
  state?: string;
};

export type RecordCurrentPointAction = {
  type?: 'recordCurrentPoint';
  clear?: boolean;
};

export type RecordPointAction = {
  type?: 'recordPoint';
  clear?: boolean;
  start?: boolean;
};

export type RecordRegionAction = {
  type?: 'recordRegion';
  dim?: 'x' | 'y';
};

export type MaskAction = {
  type?: 'mask';
  maskType?: 'rect' | 'rectX' | 'rectY' | 'polygon';
  fill?: string;
  fillOpacity?: number;
};

export type ButtonAction = {
  type?: 'button';
  position?: 'top-left' | 'top-right';
  text?: string;
  textStyle?: {
    fontSize?: number;
    fill?: string;
  };
  fill?: string;
  stroke?: string;
  radius?: number;
  padding?: number[];
  hide?: boolean;
};

export type MoveAction = {
  type?: 'move';
};

export type ActiveRegionAction = {
  type?: 'activeRegion';
  clear?: boolean;
  fill?: string;
  fillOpacity?: number;
};

export type RecordTipAction = {
  type?: 'recordTip';
  tip?: string;
};

export type PoptipAction = {
  type?: 'poptip';
  // x,y position. If not specified, using mouseX and mouseY position from shared variables.
  x?: number;
  y?: number;
  htmlStyle?: string;
};

export type CustomAction = {
  type?: ActionComponent;
  [key: string]: any;
};
