import { mapObject } from '../utils/array';
import { Container } from '../utils/container';
import { copyAttributes, error, defined, composeAsync } from '../utils/helper';
import { Selection, select } from '../utils/selection';
import {
  G2ViewTree,
  G2View,
  G2MarkOptions,
  G2ScaleOptions,
  G2ThemeOptions,
  G2Mark,
  G2Library,
  G2ShapeOptions,
  G2AnimationOptions,
  G2CompositionOptions,
  G2AdjustOptions,
  G2TransformOptions,
} from './types/options';
import {
  ThemeComponent,
  Theme,
  MarkComponent,
  Mark,
  ScaleComponent,
  Scale,
  MarkChannel,
  Shape,
  ShapeComponent,
  AnimationComponent,
  Animation,
  CompositionComponent,
  Composition,
  AdjustComponent,
  Adjust,
  TransformComponent,
  Transform,
} from './types/component';
import { Channel, G2ViewDescriptor, G2MarkState } from './types/common';
import { useLibrary } from './library';
import { initializeMark } from './mark';
import { inferComponent, renderComponent } from './component';
import { computeLayout, placeComponents } from './layout';
import { createCoordinate } from './coordinate';
import { applyScale } from './scale';
import { applyInteraction } from './interaction';

export async function plot<T extends G2ViewTree>(
  options: T,
  selection: Selection,
  library: G2Library,
): Promise<void> {
  const [useComposition] = useLibrary<
    G2CompositionOptions,
    CompositionComponent,
    Composition
  >('composition', library);

  const marks = new Set(
    Object.keys(library)
      .filter((d) => d.startsWith('mark'))
      .map((d) => d.split('.').pop()),
  );
  const views = [];
  const viewOptions = new Map();
  const discovered: G2ViewTree[] = [options];

  while (discovered.length) {
    const node = discovered.shift();
    const { type: t } = node;
    const type = typeof t === 'string' && marks.has(t) ? 'mark' : t;
    if (type === 'standardView') {
      const [view, children] = await initializeView(node, library);
      viewOptions.set(view, node);
      views.push(view);
      discovered.push(...children);
    } else {
      const composition = useComposition({ type });
      // Apply transform to get data in advance for composition node,
      // which makes sure that composition node can preprocess the
      // data to produce more nodes based on it.
      const transformedNode = await applyTransform(node, library);
      const nodes = composition(transformedNode);
      discovered.push(...nodes);
    }
  }

  selection
    .selectAll('.view')
    .data(views, (d) => d.key)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', 'view')
          .attr('id', (view) => view.id)
          .style('transform', (d) => `translate(${d.layout.x}, ${d.layout.y})`)
          .each(function (view) {
            plotView(view, select(this), library);
            const options = viewOptions.get(view);
            const update = async (updater = (d: G2View) => d) => {
              const newOptions = updater(options);
              const [newView, newChildren] = await initializeView(
                newOptions,
                library,
              );
              // Update itself and child nodes.
              plotView(newView, select(this), library);
              for (const child of newChildren) {
                plot(child, selection, library);
              }
            };
            applyInteraction(options, select(this), view, update, library);
          }),
      (update) =>
        update
          .style('transform', (d) => `translate(${d.layout.x}, ${d.layout.y})`)
          .each(function (view) {
            plotView(view, select(this), library);
          }),
      (exit) => exit.remove(),
    );
}

/**
 * @todo Nested filter for nested facet.
 */
async function initializeView(
  options: G2View,
  library: G2Library,
): Promise<[G2ViewDescriptor, G2ViewTree[]]> {
  const [useTheme] = useLibrary<G2ThemeOptions, ThemeComponent, Theme>(
    'theme',
    library,
  );
  const [useMark, createMark] = useLibrary<G2MarkOptions, MarkComponent, Mark>(
    'mark',
    library,
  );
  const [useScale] = useLibrary<G2ScaleOptions, ScaleComponent, Scale>(
    'scale',
    library,
  );
  const [useAdjust] = useLibrary<G2AdjustOptions, AdjustComponent, Adjust>(
    'adjust',
    library,
  );

  // Initialize theme.
  const {
    theme: partialTheme,
    marks: partialMarks,
    key,
    adjust,
    frame,
  } = options;
  const theme = useTheme(inferTheme(partialTheme));

  // Infer options and calc state for each mark.
  const markState = new Map<G2Mark, G2MarkState>();
  const channelScale = new Map<string, G2ScaleOptions>();
  const scales = new Set();
  for (const partialMark of partialMarks) {
    const { type = error('G2Mark type is required.') } = partialMark;
    const { props } = createMark(type);
    const markAndState = await initializeMark(
      partialMark,
      props,
      channelScale,
      theme,
      options,
      library,
    );
    if (markAndState) {
      const [mark, state] = markAndState;
      markState.set(mark, state);
      for (const scale of Object.values(mark.scale)) {
        scales.add(scale);
      }
    }
  }

  // Infer components and compute layout.
  const components = inferComponent(Array.from(scales), options, library);
  const layout = computeLayout(components, options);
  const coordinate = createCoordinate(layout, options, library);

  // Place components and mutate their bbox.
  placeComponents(components, coordinate, layout);

  // Calc data to be rendered for each mark.
  // @todo More readable APIs for Container which stays
  // the same style with JS standard and lodash APIs.
  // @todo More proper way to index scale for different marks.
  const scaleInstance = {};
  const children = [];
  for (const [mark, state] of markState.entries()) {
    const {
      scale,
      // Callback to create children options based on this mark.
      children: createChildren,
      // Filter data exclude in this facet by index.
      filter,
      // Whether to filter data exclude in this facet or not.
      facet = true,
      // The total count of data (both show and hide)for this facet.
      // This is for unit visualization to sync data domain.
      dataDomain,
      style = {},
      animate = {},
    } = mark;
    const { index, channels, defaultShape } = state;

    // Transform abstract value to visual value by scales.
    const markScaleInstance = mapObject(scale, useScale);
    Object.assign(scaleInstance, markScaleInstance);
    const value = Container.of<MarkChannel>(channels)
      .call(applyScale, markScaleInstance)
      .call(applyAnimationFunction, index, animate, defaultShape, library)
      .call(applyShapeFunction, index, style, defaultShape, library)
      .value();

    // Filter datum with falsy position value and exclude in this facet.
    // @todo Take position channel into account.
    const definedPosition = (i) => {
      const { x: X = [], y: Y = [] } = value;
      const x = X[i];
      const y = Y[i];
      const definedX = x ? x.every(defined) : true;
      const definedY = y ? y.every(defined) : true;
      return definedX && definedY;
    };
    const includeFacet = facet && filter ? filter : () => true;
    const filteredIndex = index.filter(
      (i) => definedPosition(i) && includeFacet(i),
    );

    // Calc points and transformation for each data,
    // and then transform visual value to visual data.
    const calcPoints = useMark(mark);
    const [I, P] = calcPoints(
      filteredIndex,
      markScaleInstance,
      value,
      coordinate,
    );
    const count = dataDomain || filteredIndex.length;
    const T = adjust ? useAdjust(adjust)(P, count, layout) : [];
    const visualData: Record<string, any>[] = I.map((d, i) =>
      Object.entries(value).reduce(
        (datum, [k, V]) => ((datum[k] = V[d]), datum),
        { points: P[i], transform: T[i] },
      ),
    );
    state.data = visualData;
    state.index = I;

    // Create children options by children callback,
    // and then propagate data to each child.
    const markChildren = createChildren?.(
      visualData,
      markScaleInstance,
      layout,
    );
    children.push(...(markChildren || []));
  }

  const view = {
    layout,
    theme,
    coordinate,
    components,
    markState,
    key,
    frame,
    scale: scaleInstance,
  };
  return [view, children];
}

/**
 * @todo Extract className as constants.
 */
async function plotView(
  view: G2ViewDescriptor,
  selection: Selection,
  library: G2Library,
): Promise<void> {
  const {
    components,
    theme,
    layout,
    markState,
    coordinate,
    key,
    frame = false,
  } = view;

  // Render components.
  // @todo renderComponent return ctor and options.
  selection
    .selectAll('.component')
    .data(components, (d, i) => `${d.type}-${i}`)
    .join(
      (enter) =>
        enter
          .append('g')
          .style('zIndex', ({ zIndex }) => zIndex || -1)
          .attr('className', 'component')
          .append((options) =>
            renderComponent(options, coordinate, theme, library),
          ),
      (update) =>
        update.each(function (options) {
          const newComponent = renderComponent(
            options,
            coordinate,
            theme,
            library,
          );
          const { attributes } = newComponent;
          const [node] = this.childNodes;
          node.update({ ...attributes });
        }),
    );

  // Create layers for plot.
  // Main layer is for showing the main visual representation such as marks.
  // Selection layer is for showing selected marks.
  // Transient layer is for showing transient graphical elements produced by interaction.
  // There may be multiple main layers for a view, each main layer correspond to one of
  // marks. While there is only one selection layer and transient layer for a view.
  // @todo Test DOM structure.
  selection
    .selectAll('.plot')
    .data([layout], () => key)
    .join(
      (enter) => {
        const rect = enter
          .append('rect')
          .attr('className', 'plot')
          .style('fill', 'transparent')
          .call(applyFrame, frame)
          .call(applyBBox)
          .call(applyMainLayers, Array.from(markState.keys()));
        rect
          .append('g')
          .attr('className', 'selection')
          .style('fill', 'transparent');
        rect
          .append('g')
          .attr('className', 'transient')
          .style('fill', 'transparent');
        return rect;
      },
      (update) =>
        update
          .call(applyBBox)
          .call(applyMainLayers, Array.from(markState.keys())),
    );

  // Render marks with corresponding data.
  for (const [{ key }, { data }] of markState.entries()) {
    selection
      .select(`#${key}`)
      .selectAll('.element')
      .data(data, (d) => d.key)
      .join(
        (enter) =>
          enter
            .append(({ shape, points, ...v }) =>
              shape(points, v, coordinate, theme),
            )
            .attr('className', 'element')
            .each(function ({ enterType: animate, ...v }) {
              const {
                enterDelay: delay,
                enterDuration: duration,
                enterEasing: easing,
              } = v;
              const style = { delay, duration, easing };
              animate(this, style, coordinate, theme);
            }),
        (update) =>
          update.each(function ({ shape, points, ...v }) {
            const node = shape(points, v, coordinate, theme);
            copyAttributes(this, node);
          }),
      );
  }
}

function inferTheme(theme: G2ThemeOptions = { type: 'light' }): G2ThemeOptions {
  const { type = 'light' } = theme;
  return { ...theme, type };
}

async function applyTransform<T extends G2ViewTree>(
  node: T,
  library: G2Library,
): Promise<G2ViewTree> {
  const [useTransform] = useLibrary<
    G2TransformOptions,
    TransformComponent,
    Transform
  >('transform', library);
  const { transform, data, ...rest } = node;
  if (transform === undefined) return node;
  const transformFunctions = transform.map(useTransform);
  const transformedData = await composeAsync(transformFunctions)(data);
  return { data: transformedData, ...rest };
}

function applyBBox(selection: Selection) {
  selection
    .style('x', (d) => d.paddingLeft)
    .style('y', (d) => d.paddingTop)
    .style('width', (d) => d.innerWidth)
    .style('height', (d) => d.innerHeight);
}

/**
 * Draw frame for the plot area of each facet.
 * This is useful for facet.
 * @todo More options for frame style.
 */
function applyFrame(selection: Selection, frame: boolean) {
  if (!frame) return;
  selection.style('lineWidth', 1).style('stroke', 'black');
}

/**
 * Create and update layer for each mark.
 * All the layers created here are treated as main layers.
 */
function applyMainLayers(selection: Selection, marks: G2Mark[]) {
  selection
    .selectAll('.main')
    .data(marks.map((d) => d.key))
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', 'main')
          .attr('id', (d) => d)
          .style('fill', 'transparent'),
      (update) => update,
      (exit) => exit.remove(),
    );
}

function applyAnimationFunction(
  value: Record<string, any>,
  index: number[],
  animate: G2AnimationOptions,
  defaultShape: string,
  library: G2Library,
) {
  const [, createShape] = useLibrary<G2ShapeOptions, ShapeComponent, Shape>(
    'shape',
    library,
  );
  const [useAnimation] = useLibrary<
    G2AnimationOptions,
    AnimationComponent,
    Animation
  >('animation', library);

  const { enterType: ET } = value;
  const { defaultEnterAnimation } = createShape(defaultShape).props;
  const { enter = {} } = animate;
  const { type = defaultEnterAnimation } = enter;
  const animationFunctions = Array.isArray(ET)
    ? ET.map((type) => useAnimation({ ...enter, type }))
    : index.reduce(
        (ET, i) => ((ET[i] = useAnimation({ ...enter, type })), ET),
        [],
      );
  return { ...value, enterType: animationFunctions };
}

function applyShapeFunction(
  value: Record<string, Channel>,
  index: number[],
  style: Record<string, any>,
  defaultShape: string,
  library: G2Library,
): {
  shape: Shape[];
  [key: string]: Channel | Shape[];
} {
  const [useShape] = useLibrary<G2ShapeOptions, ShapeComponent, Shape>(
    'shape',
    library,
  );
  const { shape } = value;
  const shapeFunctions = Array.isArray(shape)
    ? shape.map((type) => useShape({ ...normalizeOptions(type), ...style }))
    : index.reduce(
        (S, i) => ((S[i] = useShape({ type: defaultShape, ...style })), S),
        [],
      );
  return { ...value, shape: shapeFunctions };
}

function normalizeOptions(options: string | Record<string, any>) {
  return typeof options === 'object' ? options : { type: options };
}
