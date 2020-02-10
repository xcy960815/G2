import { Adjust, getAdjust as getAdjustClass } from '@antv/adjust';
import { Attribute, getAttribute as getAttributeClass } from '@antv/attr';
import {
  clone,
  each,
  flatten,
  get,
  isArray,
  isEmpty,
  isEqual,
  isFunction,
  isNil,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  map,
  set,
  uniq,
} from '@antv/util';
import { doGroupAppearAnimate, getDefaultAnimateCfg } from '../animate';
import Base from '../base';
import Labels from '../component/labels';
import { FIELD_ORIGIN, GROUP_ATTRS } from '../constant';
import { BBox, Coordinate, IGroup, Scale } from '../dependents';
import {
  AdjustType,
  AnimateOption,
  Data,
  Datum,
  LooseObject,
  MappingDatum,
  ScaleOption,
  ShapeFactory,
  ShapeInfo,
  ShapeMarkerCfg,
  ShapePoint,
} from '../interface';
import Element from './element';
import {
  AdjustOption,
  AttributeOption,
  ColorAttrCallback,
  GeometryLabelCfg,
  LabelCallback,
  LabelOption,
  ShapeAttrCallback,
  SizeAttrCallback,
  StateOption,
  StyleCallback,
  StyleOption,
  TooltipCallback,
  TooltipOption,
} from './interface';
import { getGeometryLabel } from './label';
import { getShapeFactory } from './shape/base';
import { group } from './util/group-data';
import { isModelChange } from './util/is-model-change';
import { parseFields } from './util/parse-fields';

interface AttributeInstanceCfg {
  fields?: string[];
  callback?: (...args) => any;
  values?: string[] | number[];
  scales?: Scale[];
}

interface AdjustInstanceCfg {
  type: AdjustType;
  adjustNames?: string[];
  xField?: string;
  yField?: string;

  dodgeBy?: string;
  marginRatio?: number;
  dodgeRatio?: number;

  size?: number;
  height?: number;
  reverseOrder?: boolean;
}

export interface InitCfg {
  coordinate?: Coordinate;
  data?: Data;
  theme?: LooseObject;
  scaleDefs?: Record<string, ScaleOption>;
}

export interface GeometryCfg {
  /** Geometry shape 的容器 */
  container: IGroup;
  /** 绘制的坐标系对象 */
  coordinate?: Coordinate;
  /** 绘制数据 */
  data?: Data;
  /** 需要的 scales */
  scales?: Record<string, Scale>;
  scaleDefs?: Record<string, ScaleOption>;
  labelsContainer?: IGroup;
  sortable?: boolean;
  visible?: boolean;
  theme?: LooseObject;
}

// 根据 elementId 查找对应的 label，因为有可能一个 element 对应多个 labels，所以在给 labels 打标识时做了处理
// 打标规则详见 ./label/base.ts#L263
function filterLabelsById(id: string, labelsMap: Record<string, IGroup>) {
  const labels = [];
  each(labelsMap, (label: IGroup, labelId: string) => {
    const elementId = labelId.split(' ')[0];
    if (elementId === id) {
      labels.push(label);
    }
  });

  return labels;
}

/**
 * Create a new Geometry
 * @class
 */
export default class Geometry extends Base {
  /** Geometry type. */
  public readonly type: string = 'base';
  /** The shapeFactory type. */
  public readonly shapeType: string;

  // can be passed in when create geometry instance
  /** [[Coordinate]] instance. */
  public coordinate: Coordinate;
  /** User data. */
  public data: Data;
  /** Graphic drawing container. */
  public readonly container: IGroup;
  /** labels container. */
  public readonly labelsContainer: IGroup;
  /** Whether to sort data, default is false.  */
  public sortable: boolean;
  /** The theme of geometry.  */
  public theme: LooseObject;
  /** 存储 geometry 需要的 scales，需要外部传入 */
  public scales: Record<string, Scale>;
  public scaleDefs: Record<string, ScaleOption>;
  /** 画布区域，用于 label 布局 */
  public canvasRegion: BBox;

  // Internally generated attributes
  /** Attribute map  */
  public attributes: Record<string, Attribute> = {};
  /** Element map */
  public elements: Element[] = [];
  /**
   * Processed data set
   * + After init() or updateData(), it is Data[]
   * + After paint(), it is MappingDatum[][]
   */
  public dataArray: MappingDatum[][];
  /** Store tooltip configuration */
  public tooltipOption: TooltipOption | boolean;
  /** label 配置项 */
  public labelOption: LabelOption | false;
  /** 状态量相关的配置项 */
  public stateOption: StateOption;
  /** animate 配置项 */
  public animateOption: AnimateOption | boolean = true;
  /** 图形属性映射配置 */
  protected attributeOption: Record<string, AttributeOption> = {};
  /** adjust 配置项 */
  protected adjustOption: AdjustOption[];
  /** style 配置项 */
  protected styleOption: StyleOption;
  protected shapeFactory: ShapeFactory;
  protected elementsMap: Record<string, Element> = {};
  protected lastElementsMap: Record<string, Element> = {};
  /** 是否生成多个点来绘制图形 */
  protected generatePoints: boolean = false;
  // 虚拟 Group
  protected offscreenGroup: IGroup;
  protected beforeMappingData: Data[] = null;

  private adjusts: Record<string, Adjust> = {};
  private lastAttributeOption;
  private labelsRenderer: Labels;

  /**
   * Creates an instance of geometry.
   * @param cfg
   */
  constructor(cfg: GeometryCfg) {
    super(cfg);

    const {
      container,
      labelsContainer,
      coordinate,
      data,
      sortable = false,
      visible = true,
      theme,
      scales = {},
      scaleDefs = {},
    } = cfg;

    this.container = container;
    this.labelsContainer = labelsContainer;
    this.coordinate = coordinate;
    this.data = data;
    this.sortable = sortable;
    this.visible = visible;
    this.theme = theme;
    this.scales = scales;
    this.scaleDefs = scaleDefs;
  }

  /**
   * 配置 position 通道映射规则
   *
   * @example
   * ```typescript
   * // data: [{ x: 'A', y: 10, color: 'red' }]
   * position('x*y');
   * position({
   *   fields: [ 'x', 'y' ],
   * });
   * ```
   *
   * @param cfg 映射规则
   * @returns
   */
  public position(cfg: string | string [] | AttributeOption): Geometry {
    // 完整结构
    if (isPlainObject(cfg)) {
      set(this.attributeOption, 'position', cfg);
    } else {
      // 字符串字段或者数组字段
      const fields = parseFields(cfg);
      if (fields.length === 1) {
        // 默认填充一维 1*xx
        fields.unshift('1');
      }
      set(this.attributeOption, 'position', {
        fields,
      });
    }

    return this;
  }

  /**
   * 配置 color 通道映射规则
   *
   * @example
   * ```typescript
   * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
   * color({
   *   fields: [ 'x' ],
   *   values: [ '#1890ff', '#5AD8A6' ],
   * });
   * ```
   *
   * @param field 映射规则
   * @returns
   */
  public color(field: AttributeOption): Geometry;
  /**
   * @example
   * ```typescript
   * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
   *
   * // use '#1890ff' rendering
   * color('#1890ff');
   *
   * // color mapping based on field values, use default colors
   * color('x');
   *
   * // color mapping based on field values, use the specified colors
   * color('x', [ '#1890ff', '#5AD8A6' ]);
   *
   * color('x', (xVal) => {
   *   if (fieldValue === 'a') {
   *     return 'red';
   *   }
   *   return 'blue';
   * });
   *
   * // 连续色值
   * color('x', '#BAE7FF-#1890FF-#0050B3');
   * ```
   *
   * @param field data fields participating in the mapping or a color value
   * @param cfg Optional, color mapping rules
   * @returns
   */
  public color(field: string, cfg?: string | string[] | ColorAttrCallback): Geometry;
  public color(field: AttributeOption | string, cfg?: string | string[] | ColorAttrCallback): Geometry {
    this.createAttrOption('color', field, cfg);

    return this;
  }

  /**
   * Configuring shape mapping rules
   *
   * @example
   *
   * ```typescript
   * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
   * shape({
   *   fields: [ 'x' ],
   * });
   * ```
   *
   * @param field mapping rule configuration
   * @returns
   */
  public shape(field: AttributeOption): Geometry;
  /**
   *
   * * @example
   * ```typescript
   * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
   *
   * // use specified shape
   * shape('circle');
   *
   * // shape mapping based on field values, use default shapes
   * shape('x');
   *
   * // shape mapping based on field values, use the specified shapes
   * shape('x', [ 'circle', 'diamond', 'square' ]);
   *
   * shape('x', (xVal) => {
   *   if (fieldValue === 'a') {
   *     return 'circle';
   *   }
   *   return 'diamond';
   * });
   * ```
   *
   * @param field data fields participating in the mapping or a shape value
   * @param cfg Optional, shape mapping rules
   * @returns
   */
  public shape(field: string, cfg?: string[] | ShapeAttrCallback): Geometry;
  public shape(field: AttributeOption | string, cfg?: string[] | ShapeAttrCallback): Geometry {
    this.createAttrOption('shape', field, cfg);

    return this;
  }

  /**
   * Configuring size mapping rules
   *
   * @example
   * ```typescript
   * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
   * size({
   *   values: [ 10 ],
   * })
   * ```
   *
   * @param field mapping rule configuration
   * @returns
   */
  public size(field: AttributeOption): Geometry;
  /**
   *
   * * @example
   * ```typescript
   * // data: [{ x: 'A', y: 10, color: 'red' }, { x: 'B', y: 30, color: 'yellow' }]
   *
   * // use specified value, 10 means '10px'
   * size(10);
   *
   * // size mapping based on field values, default size range: [1, 10]
   * size('x');
   *
   * // size mapping based on field values, use the specified size range
   * size('x', [ 5, 30 ]);
   *
   * size('x', (xVal) => {
   *   if (fieldValue === 'a') {
   *     return 10;
   *   }
   *   return 5;
   * });
   * ```
   *
   * @param field data fields participating in the mapping or a size value
   * @param cfg Optional, size mapping rules
   * @returns
   */
  public size(field: number | string, cfg?: [number, number] | SizeAttrCallback): Geometry;
  public size(field: AttributeOption | number | string, cfg?: [number, number] | SizeAttrCallback): Geometry {
    this.createAttrOption('size', field, cfg);

    return this;
  }

  /**
   * how to adjust data. Offer 4 types by defaut;
   * 1. dodge
   * 2. stack
   * 3. symmetric
   * 4. jitter
   *
   *
   * **Tip**
   * + When you use 'dodge' type, the following configurations are possible:
   * ```typescript
   * adjust('dodge', {
   *   marginRatio: 0, // used to adjust the spacing of individual columns in a group
   *   dodgeBy: 'x', // declare which field to group by
   * });
   * ```
   *
   * + When you use 'stack' type, the following configurations are possible:
   * ```typescript
   * adjust('stack', {
   *   reverseOrder: false, // whether or not to reverse data
   * });
   * ```
   *
   * @example
   * ```typescript
   * adjust('stack');
   *
   * adjust({
   *   type: 'stack',
   *   reverseOrder: false,
   * });
   *
   * // combine multiple types
   * adjust([ 'stack', 'dodge' ]);
   *
   * adjust([
   *   { type: 'stack' },
   *   { type: 'dodge', dodgeBy: 'x' },
   * ]);
   * ```
   *
   * @param adjustCfg adjust type and configuration
   * @returns
   */
  public adjust(adjustCfg: string | string[] | AdjustOption | AdjustOption[]): Geometry {
    let adjusts: any = adjustCfg;
    if (isString(adjustCfg) || isPlainObject(adjustCfg)) {
      adjusts = [adjustCfg];
    }
    each(adjusts, (adjust, index) => {
      if (!isObject(adjust)) {
        adjusts[index] = { type: adjust };
      }
    });

    this.adjustOption = adjusts;
    return this;
  }

  /**
   * Graphic style configuration
   *
   * @example
   * ```typescript
   * // just configure graphics style
   * style({
   *   lineWidth: 2,
   *   stroke: '#1890ff',
   * });
   *
   * // or configure the detail rules
   * style({
   *   fields: [ 'x', 'y' ], // data fields of participating rules
   *   callback: (xVal, yVal) => {
   *     const style = { lineWidth: 2, stroke: '#1890ff' };
   *     if (xVal === 'a') {
   *       style.lineDash = [ 2, 2 ];
   *     }
   *     return style;
   *   },
   * });
   * ```
   *
   * @param field style mapping rules or just style
   * @returns
   */
  public style(field: StyleOption | LooseObject): Geometry;
  /**
   * @example
   * ```typescript
   * style('x*y', (xVal, yVal) => {
   *   const style = { lineWidth: 2, stroke: '#1890ff' };
   *   if (xVal === 'a') {
   *     style.lineDash = [ 2, 2 ];
   *   }
   *   return style;
   * });
   * ```
   *
   * @param field data fields of participating rules
   * @param styleFunc Optional, a callback function that defines the mapping rule
   * @returns
   */
  public style(field: string, styleFunc: StyleCallback): Geometry;
  public style(field: StyleOption | LooseObject | string, styleFunc?: StyleCallback): Geometry {
    if (isString(field)) {
      const fields = parseFields(field);
      this.styleOption = {
        fields,
        callback: styleFunc,
      };
    } else {
      const { fields, callback, cfg } = field as StyleOption;
      if (fields || callback || cfg) {
        this.styleOption = field;
      } else {
        this.styleOption = {
          cfg: field,
        };
      }
    }

    return this;
  }

  /**
   * configure gemoetry tooltip's content.
   *
   * `tooltip(false)` means close the tooltip
   * `tooltip(true)` means close the tooltip
   *
   * The tooltip of geometry is open by default. So we can use this method to configure tootlip's content.
   *
   * @example
   * ```typescript
   * // data: [{x: 'a', y: 10}]
   * tooltip({
   *   fields: [ 'x' ],
   * });
   * ```
   * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*268uQ50if60AAAAAAAAAAABkARQnAQ)
   *
   * ```typescript
   * tooltip({
   *   fields: [ 'x', 'y' ],
   * });
   * ```
   * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*A_ujSa8QhtcAAAAAAAAAAABkARQnAQ)
   *
   * The tooltip() method supports callbacks in the following way:
   *
   * @example
   * ```typescript
   * chart.tooltip({
   *   itemTpl: '<li>{x}: {y}</li>',
   * });
   *
   * chart.line()
   *   .position('x*y')
   *   .tooltip({
   *     fields: [ 'x', 'y' ],
   *     callback: (x, y) => {
   *       return {
   *         x,
   *         y,
   *       };
   *     },
   *   });
   * ```
   *
   * the returned value must be an object whose attributes correspond to the `itemTpl` of chart.tooltip().
   *
   * @param field tooltip configuration
   * @returns
   */
  public tooltip(field: TooltipOption | boolean): Geometry;
  /**
   * @example
   * ```typescript
   * // data: [{x: 'a', y: 10}]
   *
   * // same with `tooltip({ fields: [ 'x' ] });`
   * tooltip('x');
   *
   * // same with `tooltip({ fields: [ 'x', 'y' ] });`
   * tooltip('x*y');
   *
   * // same with `tooltip({ fields: [ 'x', 'y' ], callback: (x, y) => { x, y } });`
   * tooltip('x*y', (x, y) => {
   *   return {
   *     x,
   *     y,
   *   };
   * });
   * ```
   *
   * @param field the data fields display in tooltip
   * @param cfg Optional, callback function to define tooltip content
   * @returns
   */
  public tooltip(field: string, cfg?: TooltipCallback): Geometry;
  public tooltip(field: TooltipOption | boolean | string, cfg?: TooltipCallback): Geometry {
    if (isString(field)) {
      const fields = parseFields(field);
      this.tooltipOption = {
        fields,
        callback: cfg,
      };
    } else {
      this.tooltipOption = field;
    }

    return this;
  }

  /**
   * Animation configuration
   *
   * + `animate(false)` to close the animation
   * + `animate(true)` to open the animation
   *
   * We divide animation into three types:
   * 1. enter
   * 2. update
   * 3. leave
   *
   * @example
   * ```typescript
   * animate({
   *   enter: {
   *     duration: 1000, // enter animation execution time
   *   },
   *   leave: false, // close leave animation
   * });
   * ```
   *
   * @param cfg animation configuration
   * @returns
   */
  public animate(cfg: AnimateOption | boolean): Geometry {
    this.animateOption = cfg;
    return this;
  }

  /**
   * configure gemoetry label
   *
   * @example
   * ```ts
   * // data: [ {x: 1, y: 2, z: 'a'}, {x: 2, y: 2, z: 'b'} ]
   * label({
   *   fields: [ 'z' ]
   * });
   *
   * label(false); // do not show label
   *
   * label('x', {
   *   style: {
   *     fill: 'red',
   *   },
   * })
   *
   * label('x', (xValue) => {
   *   return {
   *     content: xValue + '%',
   *   };
   * }, {
   *   type: 'base'
   * })
   * ```
   *
   * @param field
   * @returns label
   */
  public label(field: LabelOption | false | string): Geometry;
  public label(field: string, secondParam: GeometryLabelCfg | LabelCallback): Geometry;
  public label(field: string, secondParam: LabelCallback, thirdParam: GeometryLabelCfg): Geometry;
  public label(
    field: string | LabelOption | false,
    secondParam?: GeometryLabelCfg | LabelCallback,
    thirdParam?: GeometryLabelCfg
  ): Geometry {
    if (isString(field)) {
      const labelOption: LabelOption = {};
      const fields = parseFields(field);
      labelOption.fields = fields;
      if (isFunction(secondParam)) {
        labelOption.callback = secondParam;
      } else if (isPlainObject(secondParam)) {
        labelOption.cfg = secondParam;
      }

      if (thirdParam) {
        labelOption.cfg = thirdParam;
      }
      this.labelOption = labelOption;
    } else {
      this.labelOption = field;
    }

    return this;
  }

  /**
   * 设置状态对应的样式
   *
   * @example
   * ```ts
   * chart.interval().state({
   *   selected: {
   *     animate: { duration: 100, easing: 'easeLinear' },
   *     style: {
   *       lineWidth: 2,
   *       stroke: '#000',
   *     },
   *   },
   * });
   * ```
   *
   * 如果图形 shape 是由多个 shape 组成，即为一个 G.Group 对象，那么针对 group 中的每个 shape，我们需要使用下列方式进行状态样式设置：
   * 如果我们为 group 中的每个 shape 设置了 'name' 属性(shape.set('name', 'xx'))，则以 'name' 作为 key，否则默认以索引值（即 shape 的 添加顺序）为 key。
   *
   * ```ts
   * chart.interval().shape('groupShape').state({
   *   selected: {
   *     style: {
   *       0: { lineWidth: 2 },
   *       1: { fillOpacity: 1 },
   *     }
   *   }
   * });
   * ```
   *
   * @param cfg 状态样式
   */
  public state(cfg: StateOption) {
    this.stateOption = cfg;
    return this;
  }

  /**
   * Create [[Attribute]] and [[Scale]] instances, and data processing: group, numeric and adjust.
   * Should be called after geometry instance created.
   */
  public init(cfg: InitCfg = {}) {
    this.setCfg(cfg);
    this.initAttributes(); // 创建图形属性

    // 数据加工：分组 -> 数字化 -> adjust
    this.processData(this.data);

    // 调整 scale
    this.adjustScale();
  }

  public update(cfg: InitCfg = {}) {
    const { data } = cfg;
    const { attributeOption, lastAttributeOption } = this;

    if (!isEqual(attributeOption, lastAttributeOption)) {
      // 映射发生改变，则重新创建图形属性
      this.init(cfg);
    } else if (data && !isEqual(data, this.data)) {
      // 数据或者 scale 发生变化
      this.setCfg(cfg);
      this.processData(this.data); // 数据加工：分组 -> 数字化 -> adjust
    } else {
      // 有可能 coordinate 变化
      this.setCfg(cfg);
    }

    // 调整 scale
    this.adjustScale();
  }

  /**
   * Mapping raw data to graphics data, while create the shapes.
   * Should be called after `init()` or `pdateData()`
   */
  public paint(isUpdate: boolean = false) {
    this.elements = [];
    this.elementsMap = {};
    const offscreenGroup = this.getOffscreenGroup();
    offscreenGroup.clear();

    const beforeMappingData = this.beforeMappingData;
    const dataArray = this.beforeMapping(beforeMappingData);

    const mappingArray = [];
    for (const eachGroup of dataArray) {
      const mappingData = this.mapping(eachGroup);
      mappingArray.push(mappingData);
      this.createElements(mappingData, isUpdate);
    }

    if (this.canDoGroupAnimation(isUpdate)) {
      // 如果用户没有配置 appear.animation，就默认走整体动画
      const container = this.container;
      const type = this.type;
      const coordinate = this.coordinate;
      const animateCfg = get(this.animateOption, 'appear');
      const yScale = this.getYScale();
      const yMinPoint = coordinate.convert({
        x: 0,
        y: yScale.scale(this.getYMinValue()),
      });
      doGroupAppearAnimate(container, animateCfg, type, coordinate, yMinPoint);
    }

    // 添加 label
    if (this.labelOption) {
      this.renderLabels(flatten(mappingArray), isUpdate);
    }

    this.afterMapping(mappingArray);

    // 销毁被删除的 elements
    each(this.lastElementsMap, (deletedElement: Element) => {
      // 更新动画配置，用户有可能在更新之前有对动画进行配置操作
      deletedElement.animate = this.animateOption;
      deletedElement.destroy();
    });

    this.lastElementsMap = this.elementsMap;

    // 缓存，用于更新
    this.lastAttributeOption = {
      ...this.attributeOption,
    };

    if (this.visible === false) {
      // 用户在初始化的时候声明 visible: false
      this.changeVisible(false);
    }
  }

  /**
   * Clears geometry
   * @override
   */
  public clear() {
    const { container, labelsRenderer } = this;
    if (container) {
      container.clear();
    }

    if (labelsRenderer) {
      labelsRenderer.clear();
    }

    // 属性恢复至出厂状态
    this.attributes = {};
    this.scales = {};
    this.elementsMap = {};
    this.lastElementsMap = {};
    this.elements = [];
    this.dataArray = null;
    this.beforeMappingData = null;
    this.lastAttributeOption = undefined;
  }

  /**
   * Destroy the geometry
   */
  public destroy() {
    this.clear();
    const container = this.container;
    container.remove(true);

    if (this.offscreenGroup) {
      this.offscreenGroup.remove(true);
      this.offscreenGroup = null;
    }

    if (this.labelsRenderer) {
      this.labelsRenderer.destroy();
      this.labelsRenderer = null;
    }
    super.destroy();
  }

  /**
   * Get scales from color, shape and size attributes which determine data grouping
   * @returns
   */
  public getGroupScales(): Scale[] {
    const scales = [];
    const attributes = this.attributes;
    each(attributes, (attr: Attribute) => {
      if (GROUP_ATTRS.includes(attr.type)) {
        const attrScales = attr.scales;
        each(attrScales, (scale: Scale) => {
          if (scale.isCategory && !scales.includes(scale)) {
            scales.push(scale);
          }
        });
      }
    });

    return scales;
  }

  /**
   * Get Attribute instance by name.
   */
  public getAttribute(name: string): Attribute {
    return this.attributes[name];
  }

  /** Get the scale corresponding to the x axis */
  public getXScale(): Scale {
    return this.getAttribute('position').scales[0];
  }

  /** Get the scale corresponding to the y axis */
  public getYScale(): Scale {
    return this.getAttribute('position').scales[1];
  }

  /**
   * Get the [[Attribute]] instances that will cause the grouping
   */
  public getGroupAttributes(): Attribute[] {
    const rst = [];
    each(this.attributes, (attr: Attribute) => {
      if (GROUP_ATTRS.includes(attr.type)) {
        rst.push(attr);
      }
    });
    return rst;
  }

  public getDefaultValue(attrName: string) {
    let value: any;
    const attr = this.getAttribute(attrName);
    if (attr && isEmpty(attr.scales)) {
      // 获取映射至常量的值
      value = attr.values[0];
    }
    return value;
  }

  /**
   * Gets attribute values from a data object
   * @param attr the [[Attribute]] instance
   * @param obj a raw data
   * @returns
   */
  public getAttributeValues(attr: Attribute, obj: Datum) {
    const scales = attr.scales;

    const params = map(scales, (scale: Scale) => {
      const field = scale.field;
      if (scale.type === 'identity') {
        return scale.values[0];
      }
      if (scale.isCategory) {
        return obj[field]; // 数据有可能发生过 adjust
      }
      return obj[field];
    });
    return attr.mapping(...params);
  }

  public getAdjust(adjustType: string) {
    return this.adjusts[adjustType];
  }

  /**
   * Gets shape marker style
   * @param shapeName
   * @param cfg
   * @returns
   */
  public getShapeMarker(shapeName: string, cfg: ShapeMarkerCfg) {
    const shapeFactory = this.getShapeFactory();
    return shapeFactory.getMarker(shapeName, cfg);
  }

  /**
   * get elements which meet the user's condition
   *
   * ```typescript
   * getElementsBy((element) => {
   *   const data = element.getData();
   *
   *   return data.a === 'a';
   * });
   * ```
   *
   * @param condition callback function
   * @returns
   */
  public getElementsBy(condition: (element: Element) => boolean): Element[] {
    return this.elements.filter((element) => {
      return condition(element);
    });
  }

  public getElementId(originData: Datum) {
    const type = this.type;
    const xScale = this.getXScale();
    const yScale = this.getYScale();
    const xField = xScale.field || 'x';
    const yField = yScale.field || 'y';
    const yVal = originData[yField];
    let xVal;
    if (xScale.type === 'identity') {
      xVal = xScale.values[0];
    } else {
      xVal = originData[xField];
    }

    let id: string;
    if (type === 'interval' || type === 'schema') {
      id = xVal;
    } else if (type === 'line' || type === 'area' || type === 'path') {
      id = type;
    } else {
      id = `${xVal}-${yVal}`;
    }

    const groupScales = this.getGroupScales();
    if (!isEmpty(groupScales)) {
      each(groupScales, (groupScale: Scale) => {
        const field = groupScale.field;
        if (groupScale.type !== 'identity') {
          id = `${id}-${originData[field]}`;
        }
      });
    }

    // 用户在进行 dodge 类型的 adjust 调整的时候设置了 dodgeBy 属性
    const dodgeAdjust = this.getAdjust('dodge');
    if (dodgeAdjust) {
      const dodgeBy = dodgeAdjust.dodgeBy;
      if (dodgeBy) {
        id = `${id}-${originData[dodgeBy]}`;
      }
    }

    return id;
  }

  /**
   * 获取所有需要创建 scale 的字段名称
   */
  public getScaleFields(): string[] {
    let fields = [];
    const { attributeOption, labelOption, tooltipOption } = this;
    each(attributeOption, (eachOpt: AttributeOption) => {
      // size(10)
      fields = fields.concat(eachOpt.fields || eachOpt.values);
    });

    fields = fields.concat(get(labelOption, 'fields', []));
    fields = fields.concat(get(tooltipOption, 'fields', []));

    return uniq(fields);
  }

  public changeVisible(visible: boolean) {
    super.changeVisible(visible);
    this.elements.forEach((element: Element) => {
      element.changeVisible(visible);
    });
    if (visible) {
      if (this.container) {
        this.container.show();
      }
      if (this.labelsContainer) {
        this.labelsContainer.show();
      }
    } else {
      if (this.container) {
        this.container.hide();
      }
      if (this.labelsContainer) {
        this.labelsContainer.hide();
      }
    }
  }

  /**
   * 获取当前配置中的所有分组 & 分类的字段
   * @return fields string[]
   */
  public getGroupFields(): string[] {
    const fields = [];
    each(GROUP_ATTRS, (attributeName: string) => {
      const cfg = this.attributeOption[attributeName];
      fields.push(...get(cfg, 'fields', []));
    });

    return uniq(fields);
  }

  /**
   * 获得图形的 x y 字段
   */
  public getXYFields() {
    const [x, y] = this.attributeOption.position.fields;
    return [x, y];
  }

  protected adjustScale() {
    const yScale = this.getYScale();
    // 如果数据发生过 stack adjust，需要调整下 yScale 的数据范围
    if (this.getAdjust('stack') && yScale) {
      this.updateStackRange(yScale, this.beforeMappingData);
    }
  }

  protected getShapeFactory() {
    const shapeType = this.shapeType;
    if (!this.shapeFactory) {
      this.shapeFactory = getShapeFactory(shapeType);
    }
    // 因为这里缓存了 shapeFactory，但是外部可能会变更 coordinate，导致无法重新设置到 shapeFactory 中
    this.shapeFactory.coordinate = this.coordinate;
    // theme 原因同上
    this.shapeFactory.theme = get(this.theme, ['geometries', shapeType], {});

    return this.shapeFactory;
  }

  /**
   * Creates shape points cfg
   * @param obj 经过分组 -> 数字化 -> adjust 调整后的数据记录
   * @returns
   */
  protected createShapePointsCfg(obj: Datum): ShapePoint {
    const xScale = this.getXScale();
    const yScale = this.getYScale();
    const x = this.normalizeValues(obj[xScale.field], xScale);
    let y; // 存在没有 y 的情况

    if (yScale) {
      y = this.normalizeValues(obj[yScale.field], yScale);
    } else {
      y = obj.y ? obj.y : 0.1;
    }

    return {
      x,
      y,
      y0: yScale ? yScale.scale(this.getYMinValue()) : undefined,
    };
  }

  protected createElement(mappingDatum: MappingDatum, isUpdate: boolean = false): Element {
    const { theme, container } = this;

    const shapeCfg = this.getDrawCfg(mappingDatum); // 获取绘制图形的配置信息
    const shapeFactory = this.getShapeFactory();

    const element = new Element({
      theme: get(theme, ['geometries', this.shapeType], {}),
      shapeFactory,
      container,
      offscreenGroup: this.getOffscreenGroup(),
    });
    element.geometry = this;
    element.draw(shapeCfg, isUpdate); // 绘制

    return element;
  }

  protected getDrawCfg(mappingDatum: MappingDatum): ShapeInfo {
    const originData = mappingDatum[FIELD_ORIGIN]; // 原始数据
    const cfg: ShapeInfo = {
      mappingData: mappingDatum, // 映射后的数据
      data: originData, // 原始数据
      x: mappingDatum.x,
      y: mappingDatum.y,
      color: mappingDatum.color,
      size: mappingDatum.size,
      shape: mappingDatum.shape,
      isInCircle: this.coordinate.isPolar,
    };

    const styleOption = this.styleOption;
    if (styleOption) {
      cfg.style = this.getStyleCfg(styleOption, originData);
    }
    if (this.generatePoints) {
      cfg.points = mappingDatum.points;
      cfg.nextPoints = mappingDatum.nextPoints;
    }

    return cfg;
  }

  protected createElements(mappingData: MappingDatum[], isUpdate: boolean = false): Element[] {
    const { lastElementsMap, elementsMap, elements } = this;
    each(mappingData, (mappingDatum, i) => {
      const originData = mappingDatum[FIELD_ORIGIN];
      const id = this.getElementId(originData);
      let result = lastElementsMap[id];
      if (!result) {
        // 创建新的 element
        result = this.createElement(mappingDatum, isUpdate);
      } else {
        // element 已经创建
        const currentShapeCfg = this.getDrawCfg(mappingDatum);
        const preShapeCfg = result.getModel();
        if (isModelChange(currentShapeCfg, preShapeCfg)) {
          // 通过绘制数据的变更来判断是否需要更新，因为用户有可能会修改图形属性映射
          result.update(currentShapeCfg); // 更新对应的 element
        }

        delete lastElementsMap[id];
      }
      elements.push(result);
      elementsMap[id] = result;
    });
    return elements;
  }

  protected getOffscreenGroup() {
    if (!this.offscreenGroup) {
      const GroupCtor = this.container.getGroupBase(); // 获取分组的构造函数
      this.offscreenGroup = new GroupCtor({});
    }
    return this.offscreenGroup;
  }

  /**
   * 获取渲染的 label 类型
   */
  protected getLabelType(): string {
    const { labelOption, coordinate, type } = this;
    const coordinateType = coordinate.type;
    let labelType = get(labelOption, ['cfg', 'type']) || 'base';
    if (labelType === 'base') {
      if (coordinateType === 'polar') {
        // 极坐标文本
        labelType = 'polar';
      } else if (coordinateType === 'theta') {
        // 饼图文本
        labelType = 'pie';
      } else if (type === 'interval' || type === 'polygon') {
        labelType = 'interval';
      }
    }

    return labelType;
  }

  // 获取 Y 轴上的最小值
  protected getYMinValue(): number {
    const yScale = this.getYScale();
    const { min, max } = yScale;
    let value: number;

    if (min >= 0) {
      value = min;
    } else if (max <= 0) {
      // 当值全位于负区间时，需要保证 ymin 在区域内，不可为 0
      value = max;
    } else {
      value = 0;
    }
    return value;
  }

  // 创建图形属性相关的配置项
  private createAttrOption(attrName: string, field: AttributeOption | string | number, cfg?) {
    if (isNil(field) || isObject(field)) {
      set(this.attributeOption, attrName, field);
    } else {
      const attrCfg: AttributeOption = {};
      if (isNumber(field)) {
        // size(3)
        attrCfg.values = [field];
      } else {
        attrCfg.fields = parseFields(field);
      }

      if (cfg) {
        if (isFunction(cfg)) {
          attrCfg.callback = cfg;
        } else {
          attrCfg.values = cfg;
        }
      }

      set(this.attributeOption, attrName, attrCfg);
    }
  }

  private initAttributes() {
    const { attributes, attributeOption, theme, shapeType, coordinate } = this;

    // 遍历每一个 attrOption，各自创建 Attribute 实例
    each(attributeOption, (option: AttributeOption, attrType: string) => {
      if (!option) {
        return;
      }
      const attrCfg: AttributeInstanceCfg = {
        ...option,
      };
      const { callback, values, fields = [] } = attrCfg;

      // 获取每一个字段对应的 scale
      const scales = map(fields, (field) => {
        return this.scales[field];
      });

      attrCfg.scales = scales;

      if (attrType !== 'position' && scales.length === 1 && scales[0].type === 'identity') {
        // 用户在图形通道上声明了常量字段 color('red'), size(5)
        attrCfg.values = scales[0].values;
      } else if (!callback && !values) {
        // 用户没有指定任何规则，则使用默认的映射规则
        if (attrType === 'size') {
          attrCfg.values = theme.sizes;
        } else if (attrType === 'shape') {
          attrCfg.values = theme.shapes[shapeType] || [];
        } else if (attrType === 'color') {
          attrCfg.values = theme.colors;
        }
      }
      const AttributeCtor = getAttributeClass(attrType);
      attributes[attrType] = new AttributeCtor(attrCfg);
    });
  }

  // 处理数据：分组 -> 数字化 -> adjust 调整
  private processData(data: Data) {
    let groupedArray = this.groupData(data); // 数据分组

    groupedArray = map(groupedArray, (subData: Data) => {
      const tempData = this.saveOrigin(subData); // 存储原始数据
      this.numeric(tempData); // 将分类数据转换成数字
      return tempData;
    });

    const dataArray = this.adjustData(groupedArray); // 进行 adjust 数据调整
    this.beforeMappingData = dataArray;

    return dataArray;
  }

  // 调整数据
  private adjustData(dataArray: Data[]): Data[] {
    const adjustOption = this.adjustOption;
    let result = dataArray;
    if (adjustOption) {
      const xScale = this.getXScale();
      const yScale = this.getYScale();
      const xField = xScale.field;
      const yField = yScale ? yScale.field : null;
      adjustOption.forEach((adjust: AdjustOption) => {
        const adjustCfg: AdjustInstanceCfg = {
          xField,
          yField,
          ...adjust,
        };
        const type = adjust.type;
        if (type === 'dodge') {
          const adjustNames = [];
          if (xScale.isCategory || xScale.type === 'identity') {
            adjustNames.push('x');
          } else if (!yScale) {
            adjustNames.push('y');
          } else {
            throw new Error('dodge is not support linear attribute, please use category attribute!');
          }
          adjustCfg.adjustNames = adjustNames;
          // 每个分组内每条柱子的宽度占比，用户不可指定，用户需要通过 columnWidthRatio 指定
          adjustCfg.dodgeRatio = this.theme.columnWidthRatio;
        } else if (type === 'stack') {
          const coordinate = this.coordinate;
          if (!yScale) {
            // 一维的情况下获取高度和默认size
            adjustCfg.height = coordinate.getHeight();
            const size = this.getDefaultValue('size') || 3;
            adjustCfg.size = size;
          }
          // 不进行 transpose 时，用户又没有设置这个参数时，默认从上向下
          if (!coordinate.isTransposed && isNil(adjustCfg.reverseOrder)) {
            adjustCfg.reverseOrder = true;
          }
        }
        const adjustCtor = getAdjustClass(type);
        const adjustInstance = new adjustCtor(adjustCfg);

        result = adjustInstance.process(result);

        this.adjusts[type] = adjustInstance;
      });
    }

    return result;
  }

  // 对数据进行分组
  private groupData(data: Data): Data[] {
    const groupScales = this.getGroupScales();
    const scaleDefs = this.scaleDefs;
    const appendConditions = {};
    const groupFields = [];
    for (const scale of groupScales) {
      const field = scale.field;
      groupFields.push(field);
      if (get(scaleDefs, [field, 'values'])) {
        // 用户通过 view.scale() 接口指定了 values 属性
        appendConditions[field] = scaleDefs[field].values;
      }
    }

    return group(data, groupFields, appendConditions);
  }

  // 数据调整前保存原始数据
  private saveOrigin(data: Data): Data {
    return map(data, (originData: Datum) => {
      return {
        ...originData,
        [FIELD_ORIGIN]: originData, // 存入 origin 数据
      };
    });
  }

  // 将分类数据翻译成数据, 仅对位置相关的度量进行数字化处理
  private numeric(data: Data) {
    const positionAttr = this.getAttribute('position');
    const scales = positionAttr.scales;
    for (let j = 0, len = data.length; j < len; j += 1) {
      const obj = data[j];
      for (let i = 0; i < Math.min(2, scales.length); i += 1) {
        const scale = scales[i];
        if (scale.isCategory) {
          const field = scale.field;
          obj[field] = scale.translate(obj[field]);
        }
      }
    }
  }

  // 更新发生层叠后的数据对应的度量范围
  private updateStackRange(scale: Scale, dataArray: Data[]) {
    const mergeArray = flatten(dataArray);
    const field = scale.field;
    let min = scale.min;
    let max = scale.max;
    for (const obj of mergeArray) {
      const tmpMin = Math.min.apply(null, obj[field]);
      const tmpMax = Math.max.apply(null, obj[field]);
      if (tmpMin < min) {
        min = tmpMin;
      }
      if (tmpMax > max) {
        max = tmpMax;
      }
    }
    if (min < scale.min || max > scale.max) {
      scale.change({
        min,
        max,
      });
    }
  }

  // 将数据映射至图形空间前的操作：排序以及关键点的生成
  private beforeMapping(beforeMappingData: Data[]) {
    const source = clone(beforeMappingData);
    if (this.sortable) {
      const xScale = this.getXScale();
      const field = xScale.field;
      each(source, (data) => {
        data.sort((v1: Datum, v2: Datum) => {
          return xScale.translate(v1[field]) - xScale.translate(v2[field]);
        });
      });
    }
    if (this.generatePoints) {
      // 需要生成关键点
      each(source, (data) => {
        this.generateShapePoints(data);
      });

      source.reduce((preData: Data, currentData: Data) => {
        preData[0].nextPoints = currentData[0].points;
        return currentData;
      }, source[0]);
    }

    return source;
  }

  // 映射完毕后，对最后的结果集进行排序，方便后续 tooltip 的数据查找
  private afterMapping(mappingArray: MappingDatum[][]) {
    if (!this.sortable) {
      this.sort(mappingArray);
    }
    this.dataArray = mappingArray;
  }

  // 生成 shape 的关键点
  private generateShapePoints(data: Data) {
    const shapeFactory = this.getShapeFactory();
    const shapeAttr = this.getAttribute('shape');
    for (const obj of data) {
      const cfg = this.createShapePointsCfg(obj);
      const shape = shapeAttr ? this.getAttributeValues(shapeAttr, obj) : null;
      const points = shapeFactory.getShapePoints(shape, cfg);
      obj.points = points;
    }
  }

  // 将数据归一化
  private normalizeValues(values, scale) {
    let rst = [];
    if (isArray(values)) {
      rst = values.map((v) => scale.scale(v));
    } else {
      rst = scale.scale(values);
    }
    return rst;
  }

  // 将数据映射至图形空间
  private mapping(data: Data): MappingDatum[] {
    const attributes = this.attributes;
    const mappingData = [];
    for (const record of data) {
      const newRecord: MappingDatum = {
        _origin: record[FIELD_ORIGIN],
        points: record.points,
        nextPoints: record.nextPoints,
      };
      for (const k in attributes) {
        if (attributes.hasOwnProperty(k)) {
          const attr = attributes[k];
          const names = attr.names;
          const values = this.getAttributeValues(attr, record);
          if (names.length > 1) {
            // position 之类的生成多个字段的属性
            for (let j = 0; j < values.length; j += 1) {
              const val = values[j];
              const name = names[j];
              newRecord[name] = isArray(val) && val.length === 1 ? val[0] : val; // 只有一个值时返回第一个属性值
            }
          } else {
            // values.length === 1 的判断是以下情况，获取用户设置的图形属性值
            // shape('a', ['dot', 'dash']), color('a', ['red', 'yellow'])
            newRecord[names[0]] = values.length === 1 ? values[0] : values;
          }
        }
      }

      this.convertPoint(newRecord); // 将 x、y 转换成画布坐标
      mappingData.push(newRecord);
    }

    return mappingData;
  }

  // 将归一化的坐标值转换成画布坐标
  private convertPoint(mappingRecord: MappingDatum) {
    const { x, y } = mappingRecord;
    if (isNil(x) || isNil(y)) {
      return;
    }

    let rstX;
    let rstY;
    let obj;
    const coordinate = this.coordinate;
    if (isArray(y) && isArray(x)) {
      rstX = [];
      rstY = [];
      for (let i = 0, j = 0, xLen = x.length, yLen = y.length; i < xLen && j < yLen; i += 1, j += 1) {
        obj = coordinate.convert({
          x: x[i],
          y: y[j],
        });
        rstX.push(obj.x);
        rstY.push(obj.y);
      }
    } else if (isArray(y)) {
      rstY = [];
      y.forEach((yVal) => {
        obj = coordinate.convert({
          x: x as number,
          y: yVal,
        });
        if (rstX && rstX !== obj.x) {
          if (!isArray(rstX)) {
            rstX = [rstX];
          }
          rstX.push(obj.x);
        } else {
          rstX = obj.x;
        }
        rstY.push(obj.y);
      });
    } else if (isArray(x)) {
      rstX = [];
      x.forEach((xVal) => {
        obj = coordinate.convert({
          x: xVal,
          y: y as number,
        });
        if (rstY && rstY !== obj.y) {
          if (!isArray(rstY)) {
            rstY = [rstY];
          }
          rstY.push(obj.y);
        } else {
          rstY = obj.y;
        }
        rstX.push(obj.x);
      });
    } else {
      const point = coordinate.convert({
        x,
        y,
      });
      rstX = point.x;
      rstY = point.y;
    }
    mappingRecord.x = rstX;
    mappingRecord.y = rstY;
  }

  // 对数据进行排序
  private sort(mappingArray: Data[]) {
    const xScale = this.getXScale();
    const xField = xScale.field;
    each(mappingArray, (itemArr: Data) => {
      itemArr.sort((obj1: Datum, obj2: Datum) => {
        return xScale.translate(obj1[FIELD_ORIGIN][xField]) - xScale.translate(obj2[FIELD_ORIGIN][xField]);
      });
    });
  }

  // 获取 style 配置
  private getStyleCfg(styleOption: StyleOption, originData: Datum) {
    const { fields = [], callback, cfg } = styleOption;
    if (cfg) {
      // 用户直接配置样式属性
      return cfg;
    }

    const params = fields.map((field) => {
      return originData[field];
    });

    return callback(...params);
  }

  private setCfg(cfg: InitCfg) {
    const { coordinate, data, theme, scaleDefs } = cfg;
    if (coordinate) {
      this.coordinate = coordinate;
    }
    if (data) {
      this.data = data;
    }
    if (scaleDefs) {
      this.scaleDefs = scaleDefs;
    }
    if (theme) {
      this.theme = theme;
    }
  }

  private renderLabels(mappingArray: MappingDatum[], isUpdate: boolean = false) {
    const { labelOption, animateOption, coordinate } = this;
    const labelType = this.getLabelType();

    const GeometryLabelsCtor = getGeometryLabel(labelType);
    const geometryLabels = new GeometryLabelsCtor(this);
    const labelItems = geometryLabels.getLabelItems(mappingArray);

    let labelsRenderer = this.labelsRenderer;
    if (!labelsRenderer) {
      labelsRenderer = new Labels({
        container: this.labelsContainer,
        layout: get(labelOption, ['cfg', 'layout']),
      });
      this.labelsRenderer = labelsRenderer;
    }
    labelsRenderer.region = this.canvasRegion;

    const shapes = {};
    each(this.elementsMap, (element: Element, id: string) => {
      shapes[id] = element.shape;
    });
    // 因为有可能 shape 还在进行动画，导致 shape.getBBox() 获取到的值不是最终态，所以需要从 offscreenGroup 获取
    each(this.offscreenGroup.getChildren(), (child) => {
      const data = child.get('data');
      const id = this.getElementId(data);
      shapes[id] = child;
    });

    // 设置动画配置，如果 geometry 的动画关闭了，那么 label 的动画也会关闭
    labelsRenderer.animate = animateOption ? getDefaultAnimateCfg('label', coordinate) : false;

    // 渲染文本
    labelsRenderer.render(labelItems, shapes, isUpdate);

    const labelsMap = this.labelsRenderer.shapesMap;
    each(this.elementsMap, (element: Element, id) => {
      element.labelShape = filterLabelsById(id, labelsMap); // element 实例同 label 进行绑定
    });
  }
  /**
   * 是否需要进行群组入场动画
   * 规则：
   * 1. 如果发生更新，则不进行
   * 2. 如果用户关闭 geometry 动画，则不进行
   * 3. 如果用户关闭了 appear 动画，则不进行
   * 4. 如果用户配置了 appear.animation，则不进行
   */
  private canDoGroupAnimation(isUpdate: boolean) {
    return (
      !isUpdate &&
      this.animateOption &&
      (get(this.animateOption, 'appear') === undefined ||
        (get(this.animateOption, 'appear') && get(this.animateOption, ['appear', 'animation']) === undefined))
    );
  }
}
