import { createInteractionLibrary } from '../../../src/interaction/stdlib';
import {
  SurfacePointSelection,
  HighlightSelection,
  Tooltip,
  FisheyeFocus,
  Plot,
  ElementSelection,
  Highlight,
} from '../../../src/interaction/action';
import {
  MousePosition,
  TouchPosition,
} from '../../../src/interaction/interactor';

describe('createInteractionLibrary', () => {
  it('createInteractionLibrary() returns expected action and interactor', () => {
    expect(createInteractionLibrary()).toEqual({
      'action.surfacePointSelection': SurfacePointSelection,
      'action.elementSelection': ElementSelection,
      'action.highlightSelection': HighlightSelection,
      'action.highlight': Highlight,
      'action.tooltip': Tooltip,
      'action.fisheyeFocus': FisheyeFocus,
      'action.plot': Plot,
      'interactor.mousePosition': MousePosition,
      'interactor.touchPosition': TouchPosition,
    });
  });
});
