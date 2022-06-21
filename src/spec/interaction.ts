import { InteractionComponent } from '../runtime';
import { FisheyeCoordinate } from './coordinate';

export type Interaction =
  | ElementActiveInteraction
  | ElementHighlightInteraction
  | ElementHighlightByXInteraction
  | ElementHighlightByColorInteraction
  | TooltipInteraction
  | FisheyeInteraction
  | CustomInteraction;

export type InteractionTypes =
  | 'elementActive'
  | 'elementHighlight'
  | 'elementHighlightByColor'
  | 'elementHighlightByX'
  | 'tooltip'
  | 'fisheye'
  | InteractionComponent;

export type ElementActiveInteraction = {
  type?: 'elementActive';
  color?: string;
};

export type ElementHighlightInteraction = {
  type?: 'elementHighlight';
  color?: string;
};

export type ElementHighlightByXInteraction = {
  type?: 'elementHighlightByX';
  color?: string;
};

export type ElementHighlightByColorInteraction = {
  type?: 'elementHighlightByColor';
  color?: string;
};

export type TooltipInteraction = {
  type?: 'tooltip';
};

export type FisheyeInteraction = {
  type?: 'fisheye';
} & Omit<FisheyeCoordinate, 'type'>;

export type CustomInteraction = {
  type?: InteractionComponent;
  [key: string]: any;
};
