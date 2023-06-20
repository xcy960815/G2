import { DisplayObject, IElement, Line } from '@antv/g';
import { sort, group, mean, bisector, minIndex } from 'd3-array';
import { deepMix, lowerFirst, throttle } from '@antv/util';
import { Tooltip as TooltipComponent } from '@antv/gui';
import { Constant, Identity } from '@antv/scale';
import { defined, subObject } from '../utils/helper';
import { isTranspose, isPolar } from '../utils/coordinate';
import { angle, sub } from '../utils/vector';
import { invert } from '../utils/scale';
import { BBox } from '../runtime';
import {
  selectG2Elements,
  createXKey,
  selectPlotArea,
  mousePosition,
  selectFacetG2Elements,
  createDatumof,
  selectElementByData,
} from './utils';
import { dataOf } from './event';

function getContainer(
  group: IElement,
  mount: string | HTMLElement,
): HTMLElement {
  if (mount)
    return typeof mount === 'string' ? document.querySelector(mount) : mount;
  // @ts-ignore
  return group.getRootNode().defaultView.getConfig().container;
}

function getBounding(root): BBox {
  const bbox = root.getBounds();
  const {
    min: [x1, y1],
    max: [x2, y2],
  } = bbox;
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}

function getContainerOffset(
  container1: HTMLElement,
  container2: HTMLElement,
): { x: number; y: number } {
  const r1 = container1.getBoundingClientRect();
  const r2 = container2.getBoundingClientRect();
  return {
    x: r1.x - r2.x,
    y: r1.y - r2.y,
  };
}

function createTooltip(
  container: HTMLElement,
  x0,
  y0,
  position,
  enterable,
  bounding,
  containerOffset,
) {
  const tooltipElement = new TooltipComponent({
    className: 'tooltip',
    style: {
      x: x0,
      y: y0,
      container: containerOffset,
      data: [],
      bounding,
      position,
      enterable,
      title: '',
      offset: [10, 10],
      template: {
        prefixCls: 'g2-',
      },
      style: {
        '.g2-tooltip': {},
        '.g2-tooltip-title': {
          overflow: 'hidden',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
        },
      },
    },
  });
  container.appendChild(tooltipElement.HTMLTooltipElement);
  return tooltipElement;
}

function showTooltip({
  root,
  data,
  x,
  y,
  render,
  event,
  single,
  position = 'right-bottom',
  enterable = false,
  mount,
  bounding,
}) {
  // All the views share the same tooltip.
  const canvasContainer = root.getRootNode().defaultView.getConfig().container;
  const container = single ? getContainer(root, mount) : root;
  const b = bounding || getBounding(root);
  const containerOffset = getContainerOffset(canvasContainer, container);
  const {
    tooltipElement = createTooltip(
      container,
      x,
      y,
      position,
      enterable,
      b,
      containerOffset,
    ),
  } = container;
  const { items, title = '' } = data;
  tooltipElement.update({
    x,
    y,
    data: items,
    title,
    position,
    enterable,
    ...(render !== undefined && {
      content: render(event, { items, title }),
    }),
  });
  container.tooltipElement = tooltipElement;
}

function hideTooltip({ root, single, emitter, nativeEvent = true, mount }) {
  const container = single ? getContainer(root, mount) : root;
  const { tooltipElement } = container;
  if (tooltipElement) {
    tooltipElement.hide();
    if (nativeEvent) {
      emitter.emit('tooltip:hide', { nativeEvent });
    }
  }
}

function destroyTooltip(root) {
  const { tooltipElement } = root;
  if (tooltipElement) {
    tooltipElement.destroy();
    root.tooltipElement = undefined;
  }
}

function showUndefined(item) {
  const { value } = item;
  return { ...item, value: value === undefined ? 'undefined' : value };
}

function singleItem(element) {
  const { __data__: datum } = element;
  const { title, items = [] } = datum;
  const newItems = items
    .filter(defined)
    .map(({ color = itemColorOf(element), ...item }) => ({
      ...item,
      color,
    }))
    .map(showUndefined);
  return {
    ...(title && { title }),
    items: newItems,
  };
}

function groupNameOf(scale, datum) {
  const { color: scaleColor, series: scaleSeries } = scale;
  const { color, series } = datum;
  const invertAble = (scale) => {
    return (
      scale &&
      scale.invert &&
      !(scale instanceof Identity) &&
      !(scale instanceof Constant)
    );
  };
  // For non constant color channel.
  if (invertAble(scaleSeries)) return scaleSeries.invert(series);
  if (series && series !== color) return series;
  if (invertAble(scaleColor)) {
    const name = scaleColor.invert(color);
    // For threshold scale.
    if (Array.isArray(name)) return null;
    return name;
  }
  return null;
}

function itemColorOf(element) {
  const fill = element.getAttribute('fill');
  const stroke = element.getAttribute('stroke');
  const { __data__: datum } = element;
  const { color = fill && fill !== 'transparent' ? fill : stroke } = datum;
  return color;
}

function unique(items, key = (d) => d) {
  const valueName = new Map(items.map((d) => [key(d), d]));
  return Array.from(valueName.values());
}

function groupItems(
  elements,
  scale,
  groupName,
  data = elements.map((d) => d['__data__']),
) {
  const key = (d) => (d instanceof Date ? +d : d);
  const T = unique(
    data.map((d) => d.title),
    key,
  ).filter(defined);
  const newItems = data
    .flatMap((datum, i) => {
      const element = elements[i];
      const { items = [], title } = datum;
      const definedItems = items.filter(defined);

      // If there is only one item, use groupName as title by default.
      const useGroupName =
        groupName !== undefined ? groupName : items.length <= 1 ? true : false;

      return definedItems.map(
        ({ color = itemColorOf(element), name, ...item }) => {
          const name1 = useGroupName
            ? groupNameOf(scale, datum) || name
            : name || groupNameOf(scale, datum);
          return {
            ...item,
            color,
            name: name1 || title,
          };
        },
      );
    })
    .map(showUndefined);
  return {
    ...(T.length > 0 && { title: T.join(',') }),
    items: unique(
      newItems,
      (d) => `(${key(d.name)}, ${key(d.value)}, ${key(d.color)})`,
    ),
  };
}

function updateRuleY(
  root,
  points,
  {
    plotWidth,
    plotHeight,
    mainWidth,
    mainHeight,
    startX,
    startY,
    transposed,
    polar,
    insetLeft,
    insetTop,
    ...rest
  },
) {
  const defaults = {
    lineWidth: 1,
    stroke: '#1b1e23',
    strokeOpacity: 0.5,
    ...rest,
  };
  const Y = points.map((p) => p[1]);
  const X = points.map((p) => p[0]);
  const y = mean(Y);
  const x = mean(X);
  const pointsOf = () => {
    if (polar) {
      const r = Math.min(mainWidth, mainHeight) / 2;
      const cx = startX + insetLeft + mainWidth / 2;
      const cy = startY + insetTop + mainHeight / 2;
      const a = angle(sub([x, y], [cx, cy]));
      const x0 = cx + r * Math.cos(a);
      const y0 = cy + r * Math.sin(a);
      return [cx, x0, cy, y0];
    }
    if (transposed) return [startX, startX + plotWidth, y + startY, y + startY];
    return [x + startX, x + startX, startY, startY + plotHeight];
  };
  const [x1, x2, y1, y2] = pointsOf();
  const createLine = () => {
    const line = new Line({
      style: {
        x1,
        x2,
        y1,
        y2,
        ...defaults,
      },
    });
    root.appendChild(line);
    return line;
  };
  // Only update rule with defined series elements.
  if (X.length > 0) {
    const ruleY = root.ruleY || createLine();
    ruleY.style.x1 = x1;
    ruleY.style.x2 = x2;
    ruleY.style.y1 = y1;
    ruleY.style.y2 = y2;
    root.ruleY = ruleY;
  }
}

function hideRuleY(root) {
  if (root.ruleY) {
    root.ruleY.remove();
    root.ruleY = undefined;
  }
}

function interactionKeyof(markState, key) {
  return Array.from(markState.values()).some(
    // @ts-ignore
    (d) => d.interaction?.[key],
  );
}

function maybeValue(specified, defaults) {
  return specified === undefined ? defaults : specified;
}

function isEmptyTooltipData(data) {
  const { title, items } = data;
  if (items.length === 0 && title === undefined) return true;
  return false;
}

function hasSeries(markState): boolean {
  return Array.from(markState.values()).some(
    // @ts-ignore
    (d) => d.interaction?.seriesTooltip && d.tooltip,
  );
}

/**
 * Show tooltip for series item.
 */
export function seriesTooltip(
  root: DisplayObject,
  {
    elements: elementsof,
    sort: sortFunction,
    filter: filterFunction,
    scale,
    coordinate,
    crosshairs,
    render,
    groupName,
    emitter,
    wait = 50,
    leading = true,
    trailing = false,
    startX = 0,
    startY = 0,
    body = true,
    single = true,
    position,
    enterable,
    mount,
    bounding,
    style: _style = {},
    ...rest
  }: Record<string, any>,
) {
  const elements = elementsof(root);
  const transposed = isTranspose(coordinate);
  const polar = isPolar(coordinate);
  const style = deepMix(_style, rest);
  const {
    innerWidth: plotWidth,
    innerHeight: plotHeight,
    width: mainWidth,
    height: mainHeight,
    insetLeft,
    insetTop,
  } = coordinate.getOptions();

  // Split elements into series elements and item elements.
  const seriesElements = [];
  const itemElements = [];
  for (const element of elements) {
    const { __data__: data } = element;
    const { seriesX } = data;
    if (seriesX) seriesElements.push(element);
    else itemElements.push(element);
  }

  // Sorted elements from top to bottom visually,
  // or from right to left in transpose coordinate.
  seriesElements.sort((a, b) => {
    const index = transposed ? 0 : 1;
    const minY = (d) => d.getBounds().min[index];
    return transposed ? minY(b) - minY(a) : minY(a) - minY(b);
  });

  // Get sortedIndex and X for each series elements
  const elementSortedX = new Map(
    seriesElements.map((element) => {
      const { __data__: data } = element;
      const { seriesX } = data;
      const seriesIndex = seriesX.map((_, i) => i);
      const sortedIndex = sort(seriesIndex, (i) => seriesX[+i]);
      return [element, [sortedIndex, seriesX]];
    }),
  );

  const ruleStyle = subObject(style, 'crosshairs');
  const { x: scaleX } = scale;

  // Apply offset for band scale x.
  const offsetX = scaleX?.getBandWidth ? scaleX.getBandWidth() / 2 : 0;

  const abstractX = (focus) => {
    const [normalizedX] = coordinate.invert(focus);
    return normalizedX - offsetX;
  };

  const indexByFocus = (focus, I, X) => {
    const finalX = abstractX(focus);
    const [minX, maxX] = sort([X[0], X[X.length - 1]]);
    // Skip x out of range.
    if (finalX < minX || finalX > maxX) return null;
    const search = bisector((i) => X[+i]).center;
    const i = search(I, finalX);
    return I[i];
  };

  const elementsByFocus = (focus, elements) => {
    const index = transposed ? 1 : 0;
    const x = focus[index];
    const extent = (d) => {
      const { min, max } = d.getLocalBounds();
      return sort([min[index], max[index]]);
    };
    return elements.filter((element) => {
      const [min, max] = extent(element);
      return x >= min && x <= max;
    });
  };

  const seriesData = (element, index) => {
    const { __data__: data } = element;
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => key.startsWith('series') && key !== 'series')
        .map(([key, V]) => {
          const d = V[index];
          return [lowerFirst(key.replace('series', '')), d];
        }),
    );
  };

  const update = throttle(
    (event) => {
      const mouse = mousePosition(root, event);
      if (!mouse) return;
      const bbox = root.getRenderBounds();
      const x = bbox.min[0];
      const y = bbox.min[1];
      const focus = [mouse[0] - startX, mouse[1] - startY];
      if (!focus) return;
      // Get selected item element.
      const selectedItems = elementsByFocus(focus, itemElements);

      // Get selected data item from both series element and item element.
      const selectedSeriesElements = [];
      const selectedSeriesData = [];
      for (const element of seriesElements) {
        const [sortedIndex, X] = elementSortedX.get(element);
        const index = indexByFocus(focus, sortedIndex, X);
        if (index !== null) {
          selectedSeriesElements.push(element);
          const d = seriesData(element, index);
          const { x, y } = d;
          const p = coordinate.map([(x || 0) + offsetX, y || 0]);
          selectedSeriesData.push([d, p] as const);
        }
      }

      // Filter selectedSeriesData with different x,
      // make sure there is only one x closest to focusX.
      const SX = Array.from(new Set(selectedSeriesData.map((d) => d[0].x)));
      const closestX = SX[minIndex(SX, (x) => Math.abs(x - abstractX(focus)))];
      const filteredSeriesData = selectedSeriesData.filter(
        (d) => d[0].x === closestX,
      );

      const selectedData = [
        ...filteredSeriesData.map((d) => d[0]),
        ...selectedItems.map((d) => d.__data__),
      ];

      // Get the displayed tooltip data.
      const selectedElements = [...selectedSeriesElements, ...selectedItems];
      const tooltipData = groupItems(
        selectedElements,
        scale,
        groupName,
        selectedData,
      );

      // Sort items and filter items.
      if (sortFunction) {
        tooltipData.items.sort((a, b) => sortFunction(a) - sortFunction(b));
      }
      if (filterFunction) {
        tooltipData.items = tooltipData.items.filter(filterFunction);
      }

      // Hide tooltip with no selected tooltip.
      if (selectedElements.length === 0 || isEmptyTooltipData(tooltipData)) {
        hide();
        return;
      }

      if (body) {
        showTooltip({
          root,
          data: tooltipData,
          x: mouse[0] + x,
          y: mouse[1] + y,
          render,
          event,
          single,
          position,
          enterable,
          mount,
          bounding,
        });
      }

      if (crosshairs) {
        const points = filteredSeriesData.map((d) => d[1]);
        updateRuleY(root, points, {
          ...ruleStyle,
          plotWidth,
          plotHeight,
          mainWidth,
          mainHeight,
          insetLeft,
          insetTop,
          startX,
          startY,
          transposed,
          polar,
        });
      }

      emitter.emit('tooltip:show', {
        ...event,
        nativeEvent: true,
        data: { data: { x: invert(scale.x, abstractX(focus), true) } },
      });
    },
    wait,
    { leading, trailing },
  ) as (...args: any[]) => void;

  const hide = () => {
    hideTooltip({ root, single, emitter, mount });
    if (crosshairs) hideRuleY(root);
  };

  const onTooltipShow = ({ nativeEvent, data }) => {
    if (nativeEvent) return;
    const { x } = data.data;
    const { x: scaleX } = scale;
    const x1 = scaleX.map(x);
    const [x2, y2] = coordinate.map([x1, 0.5]);
    const {
      min: [minX, minY],
    } = root.getRenderBounds();
    update({ offsetX: x2 + minX, offsetY: y2 + minY });
  };

  const onTooltipHide = () => {
    hideTooltip({ root, single, emitter, nativeEvent: false, mount });
  };

  emitter.on('tooltip:show', onTooltipShow);
  emitter.on('tooltip:hide', onTooltipHide);

  root.addEventListener('pointerenter', update);
  root.addEventListener('pointermove', update);
  root.addEventListener('pointerleave', hide);

  return () => {
    root.removeEventListener('pointerenter', update);
    root.removeEventListener('pointermove', update);
    root.removeEventListener('pointerleave', hide);
    emitter.off('tooltip:show', onTooltipShow);
    emitter.off('tooltip:hide', onTooltipHide);
    destroyTooltip(root);
    if (crosshairs) hideRuleY(root);
  };
}

/**
 * Show tooltip for non-series item.
 */
export function tooltip(
  root: DisplayObject,
  {
    elements: elementsof,
    scale,
    render,
    groupName,
    sort: sortFunction,
    filter: filterFunction,
    emitter,
    wait = 50,
    leading = true,
    trailing = false,
    groupKey = (d) => d, // group elements by specified key
    single = true,
    position,
    enterable,
    datum,
    view,
    mount,
    bounding,
  }: Record<string, any>,
) {
  const elements = elementsof(root);
  const elementSet = new Set(elements);
  const keyGroup = group(elements, groupKey);

  const pointerover = throttle(
    (event) => {
      const { target: element } = event;
      if (!elementSet.has(element)) {
        hideTooltip({ root, single, emitter, mount });
        return;
      }
      const k = groupKey(element);
      const group = keyGroup.get(k);
      const data =
        group.length === 1
          ? singleItem(group[0])
          : groupItems(group, scale, groupName);

      // Sort items and sort.
      if (sortFunction) {
        data.items.sort((a, b) => sortFunction(a) - sortFunction(b));
      }
      if (filterFunction) {
        data.items = data.items.filter(filterFunction);
      }

      if (isEmptyTooltipData(data)) {
        hideTooltip({ root, single, emitter, mount });
        return;
      }

      const { offsetX, offsetY } = event;
      showTooltip({
        root,
        data,
        x: offsetX,
        y: offsetY,
        render,
        event,
        single,
        position,
        enterable,
        mount,
        bounding,
      });

      emitter.emit('tooltip:show', {
        ...event,
        nativeEvent: true,
        data: {
          data: dataOf(element, view),
        },
      });
    },
    wait,
    { leading, trailing },
  ) as (...args: any[]) => void;

  const pointerout = (event) => {
    const { target: element } = event;
    if (!elementSet.has(element)) return;
    hideTooltip({ root, single, emitter, mount });
  };

  const onTooltipShow = ({ nativeEvent, data }) => {
    if (nativeEvent) return;
    const element = selectElementByData(elements, data.data, datum);
    if (!element) return;
    const bbox = element.getBBox();
    const { x, y, width, height } = bbox;
    pointerover({
      target: element,
      offsetX: x + width / 2,
      offsetY: y + height / 2,
    });
  };

  const onTooltipHide = ({ nativeEvent }: any = {}) => {
    if (nativeEvent) return;
    hideTooltip({ root, single, emitter, nativeEvent: false, mount });
  };

  emitter.on('tooltip:show', onTooltipShow);
  emitter.on('tooltip:hide', onTooltipHide);

  root.addEventListener('pointerover', pointerover);
  root.addEventListener('pointermove', pointerover);
  root.addEventListener('pointerout', pointerout);

  return () => {
    root.removeEventListener('pointerover', pointerover);
    root.removeEventListener('pointermove', pointerover);
    root.removeEventListener('pointerout', pointerout);
    emitter.off('tooltip:show', onTooltipShow);
    emitter.off('tooltip:hide', onTooltipHide);
    destroyTooltip(root);
  };
}

export function Tooltip(options) {
  const {
    shared,
    crosshairs,
    series,
    name,
    item = () => ({}),
    facet = false,
    ...rest
  } = options;
  return (target, viewInstances, emitter) => {
    const { container, view } = target;
    const { scale, markState, coordinate } = view;
    // Get default value from mark states.
    const defaultSeries = interactionKeyof(markState, 'seriesTooltip');
    const defaultShowCrosshairs = interactionKeyof(markState, 'crosshairs');
    const plotArea = selectPlotArea(container);
    const isSeries = maybeValue(series, defaultSeries);

    // For non-facet and series tooltip.
    if (isSeries && hasSeries(markState) && !facet) {
      return seriesTooltip(plotArea, {
        ...rest,
        elements: selectG2Elements,
        scale,
        coordinate,
        crosshairs: maybeValue(crosshairs, defaultShowCrosshairs),
        item,
        emitter,
      });
    }

    // For facet and series tooltip.
    if (isSeries && facet) {
      // Get sub view instances for this view.
      const facetInstances = viewInstances.filter(
        (d) => d !== target && d.options.parentKey === target.options.key,
      );
      const elements = selectFacetG2Elements(target, viewInstances);
      // Use the scale of the first view.
      const scale = facetInstances[0].view.scale;
      const bbox = plotArea.getBounds();
      const startX = bbox.min[0];
      const startY = bbox.min[1];

      // @todo Nested structure rather than flat structure for facet?
      // Add listener to the root area.
      // @ts-ignore
      return seriesTooltip(plotArea.parentNode.parentNode, {
        ...rest,
        elements: () => elements,
        scale,
        coordinate,
        crosshairs: maybeValue(crosshairs, defaultShowCrosshairs),
        item,
        startX,
        startY,
        emitter,
      });
    }

    return tooltip(plotArea, {
      ...rest,
      datum: createDatumof(view),
      elements: selectG2Elements,
      scale,
      coordinate,
      groupKey: shared ? createXKey(view) : undefined,
      item,
      emitter,
      view,
    });
  };
}
