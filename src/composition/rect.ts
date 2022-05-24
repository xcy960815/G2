import { deepMix } from '@antv/util';
import { group } from 'd3-array';
import {
  CompositionComponent as CC,
  G2MarkChildrenCallback,
  G2ViewTree,
  Node,
} from '../runtime';
import { RectComposition } from '../spec';
import { calcBBox } from '../utils/vector';
import { Container } from '../utils/container';
import { indexOf } from '../utils/array';
import { useDefaultAdaptor, useOverrideAdaptor } from './utils';

const setScale = useDefaultAdaptor<G2ViewTree>((options) => {
  const { encode, data, scale, shareSize = false } = options;
  const { x, y } = encode;
  const flexDomain = (encode: string, channel: string) => {
    if (encode === undefined || !shareSize) return {};
    const groups = group(data, (d) => d[encode]);
    const domain = scale?.[channel]?.domain || Array.from(groups.keys());
    const flex = domain.map((key) => {
      if (!groups.has(key)) return 1;
      return groups.get(key).length;
    });
    return { domain, flex };
  };
  return {
    scale: {
      x: {
        paddingOuter: 0,
        guide: x === undefined ? null : { position: 'top' },
        ...(x === undefined && { paddingInner: 0 }),
        ...flexDomain(x, 'x'),
      },
      y: {
        range: [0, 1],
        paddingOuter: 0,
        guide: y === undefined ? null : { position: 'right' },
        ...(y === undefined && { paddingInner: 0 }),
        ...flexDomain(y, 'y'),
      },
    },
  };
});

/**
 * BFS view tree and using the last discovered color encode
 * as the top-level encode for this plot. This is useful when
 * color encode and color scale is specified in mark node.
 * It makes sense because the whole facet should shared the same
 * color encoding, but it also can be override with explicity
 * encode and scale specification.
 */
const inferColor = useDefaultAdaptor<G2ViewTree>((options: G2ViewTree) => {
  const { data, scale } = options;
  const discovered = [options];
  let encodeColor;
  let scaleColor;
  while (discovered.length) {
    const node = discovered.shift();
    const { children, encode = {}, scale = {} } = node;
    const { color: c } = encode;
    const { color: cs } = scale;
    if (c !== undefined) encodeColor = c;
    if (cs !== undefined) scaleColor = cs;
    if (Array.isArray(children)) {
      discovered.push(...children);
    }
  }

  const domainColor = () => {
    const domain = scale?.color?.domain;
    if (domain !== undefined) return domain;
    if (encodeColor === undefined) return undefined;
    return Array.from(new Set(data.map((d) => d[encodeColor])));
  };

  return {
    encode: {
      color: encodeColor,
    },
    scale: {
      color: deepMix({}, scaleColor, { domain: domainColor() }),
    },
  };
});

const setAnimation = useDefaultAdaptor<G2ViewTree>(() => ({
  animate: {
    enter: {
      type: 'fadeIn',
    },
  },
}));

const setStyle = useOverrideAdaptor<G2ViewTree>(() => ({
  frame: false,
  encode: {
    shape: 'hollowRect',
  },
  style: {
    lineWidth: 0,
  },
}));

const filterData = useOverrideAdaptor<G2ViewTree>((options) => {
  const { data: rawData, filter } = options;
  const data = filter ? rawData.filter((_, i) => filter(i)) : rawData;
  // Filter options for rect is to filter data from its parent
  // Node. It should be removed after being called.
  return { data, filter: null };
});

const toGrid = useOverrideAdaptor<G2ViewTree>(() => ({
  type: 'grid',
}));

/**
 * Filter data to make sure that there is only one grid
 * rendered for each x value and y value.
 **/
const setFilterPreprocessor = useOverrideAdaptor<G2ViewTree>((options) => {
  const { transform = [] } = options;
  const Filter = () => {
    return (context) => {
      const { data, columnOf, encode } = context;
      const { x, y } = encode;
      const X = columnOf(data, x);
      const Y = columnOf(data, y);
      const keys = new Set();
      const newData = data.filter((_, i) => {
        const x = X?.[i];
        const y = Y?.[i];
        const key = `(${x}, ${y})`;
        if (keys.has(key)) return false;
        keys.add(key);
        return true;
      });
      return {
        ...context,
        data: newData,
        I: new Array(newData.length).fill(0).map((_, i) => i),
      };
    };
  };

  Filter.props = {
    type: 'preprocessor',
  };

  return {
    transform: [...transform, { type: Filter }],
  };
});

/**
 * @todo Move some options assignment to runtime.
 */
const setChildren = useOverrideAdaptor<G2ViewTree>((options) => {
  const {
    data,
    encode,
    children,
    scale: facetScale,
    x: originX = 0,
    y: originY = 0,
    shareData = false,
  } = options;
  const { x: encodeX, y: encodeY } = encode;
  const { color: facetScaleColor } = facetScale;
  const { domain: facetDomainColor } = facetScaleColor;
  const createChildren: G2MarkChildrenCallback = (
    visualData,
    scale,
    layout,
  ) => {
    const { x: scaleX, y: scaleY } = scale;
    const { paddingLeft, paddingTop } = layout;
    const { domain: domainX, field: fieldX } = scaleX.getOptions();
    const { domain: domainY, field: fieldY } = scaleY.getOptions();
    const index = indexOf(visualData);
    const bboxs = visualData.map(({ points }) => calcBBox(points));
    const values = visualData.map(({ x, y }) => [
      scaleX.invert(x),
      scaleY.invert(y),
    ]);
    const filters = values.map(([fx, fy]) => (d) => {
      const { [fieldX]: x, [fieldY]: y } = d;
      const inX = encodeX !== undefined ? x === fx : true;
      const inY = encodeY !== undefined ? y === fy : true;
      return inX && inY;
    });
    const maxDataDomain = shareData
      ? filters.reduce(
          (max, filter) => Math.max(max, data.filter(filter).length),
          -Infinity,
        )
      : undefined;
    const facets = values.map(([fx, fy]) => ({
      columnField: fieldX,
      columnIndex: domainX.indexOf(fx),
      columnValue: fx,
      columnValuesLength: domainX.length,
      rowField: fieldY,
      rowIndex: domainY.indexOf(fy),
      rowValue: fy,
      rowValuesLength: domainY.length,
    }));
    const normalizedChildren: Node[] = facets.map((facet) => {
      if (Array.isArray(children)) return children;
      return [children(facet)].flat(1);
    });
    return index.flatMap((i) => {
      const [left, top, width, height] = bboxs[i];
      const filter = filters[i];
      const facet = facets[i];
      const children = normalizedChildren[i];
      return children.map(({ scale, key, ...rest }) => {
        const guideY = scale?.y?.guide;
        const guideX = scale?.x?.guide;
        const defaultScale = { x: { tickCount: 5 }, y: { tickCount: 5 } };
        const newScale = {
          x: { guide: createGuideX(guideX)(facet) },
          y: { guide: createGuideY(guideY)(facet) },
          // Hide all legends for child mark by default,
          // they are displayed in the top-level.
          color: { guide: null, domain: facetDomainColor },
        };
        return {
          key: `${key}-${i}`,
          data,
          filter: (i) => filter(data[i]),
          x: left + paddingLeft + originX,
          y: top + paddingTop + originY,
          width,
          height,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          frame: true,
          dataDomain: maxDataDomain,
          scale: deepMix(defaultScale, scale, newScale),
          ...rest,
        };
      });
    });
  };
  return {
    children: createChildren,
  };
});

function createGuideX(guideX) {
  if (typeof guideX === 'function') return guideX;
  if (guideX === null) return () => null;
  return (facet) => {
    const { rowIndex, rowValuesLength, columnIndex, columnValuesLength } =
      facet;
    // Only the bottom-most facet show axisX.
    if (rowIndex !== rowValuesLength - 1) return null;
    // Only the bottom-left facet show title.
    if (columnIndex !== columnValuesLength - 1) {
      return deepMix({ title: false }, guideX);
    }
  };
}

function createGuideY(guideY) {
  if (typeof guideY === 'function') return guideY;
  if (guideY === null) return () => null;
  return (facet) => {
    const { rowIndex, columnIndex } = facet;
    // Only the left-most facet show axisY.
    if (columnIndex !== 0) return null;
    // Only the left-top facet show title.
    if (rowIndex !== 0) return deepMix({ title: false }, guideY);
  };
}

export type RectOptions = Omit<RectComposition, 'type'>;

export const Rect: CC<RectOptions> = () => {
  return (options) => {
    const newOptions = Container.of<G2ViewTree>(options)
      .call(toGrid)
      .call(filterData)
      .call(inferColor)
      .call(setAnimation)
      .call(setScale)
      .call(setStyle)
      .call(setFilterPreprocessor)
      .call(setChildren)
      .value();
    return [newOptions];
  };
};

Rect.props = {};
