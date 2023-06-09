import { AnimationComponent as AC } from '../runtime';
import { Animation } from './types';

export type ZoomInOptions = Animation;

export const ZoomIn: AC<ZoomInOptions> = (options) => {
  // Small enough to hide or show very small part of mark,
  // but bigger enough to not cause bug.
  const ZERO = 0.0001;

  return (from, _, defaults) => {
    const [shape] = from;
    const {
      transform: prefix = '',
      fillOpacity = 1,
      strokeOpacity = 1,
      opacity = 1,
    } = shape.style;
    const keyframes = [
      {
        transform: `${prefix} scale(${ZERO})`.trimStart(),
        fillOpacity: 0,
        strokeOpacity: 0,
        opacity: 0,
      },
      {
        transform: `${prefix} scale(${ZERO})`.trimStart(),
        fillOpacity,
        strokeOpacity,
        opacity,
        offset: 0.01,
      },
      {
        transform: `${prefix} scale(1)`.trimStart(),
        fillOpacity,
        strokeOpacity,
        opacity,
      },
    ];
    const { width, height } = shape.getBoundingClientRect();
    // Change transform origin for correct transform.
    shape.setOrigin([width / 2, height / 2]);

    const animation = shape.animate(keyframes, { ...defaults, ...options });

    // Reset transform origin to eliminate side effect for following animations.
    animation.finished.then(() => shape.setOrigin(0, 0));

    return animation;
  };
};
