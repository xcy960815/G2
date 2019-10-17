import EE from '@antv/event-emitter';
import * as _ from '@antv/util';
import {
  AxisOption,
  ComponentOption,
  CoordinateCfg,
  CoordinateOption,
  FilterCondition,
  Options,
  ScaleOption,
  ViewCfg,
} from 'chart/interface';
import Component from 'component';
import { Coordinate, Scale } from 'dependents';
import Geometry from 'geometry/base';
import Interaction from 'interaction';
import { Padding, Point, Region } from 'interface';
import { ComponentType, DIRECTION, GroupZIndex, LAYER, ViewLifeCircle } from '../constant';
import { Attribute } from '../dependents';
import { BBox, ICanvas, IGroup } from '../dependents';
import { Facet, getFacet } from '../facet';
import { FacetCfg, FacetCfgMap } from '../facet/interface';
import { Data, Datum } from '../interface';
import { isFullCircle } from '../util/coordinate';
import { parsePadding } from '../util/padding';
import { mergeTheme } from '../util/theme';
import Chart from './chart';
import { createAxes } from './controller/axis';
import { createCoordinate } from './controller/coordinate';
import { createLegends } from './controller/legend';
import defaultLayout, { Layout } from './layout';

/**
 * View 对象
 */
export default class View extends EE {
  /** 父级 view，如果没有父级，则为空 */
  public parent: View;
  /** 所有的子 view */
  public views: View[] = [];
  /** 所有的 geometry 实例 */
  public geometries: Geometry[] = [];

  /** view 实际的绘图区域，除去 padding，出去组件占用空间 */
  public viewBBox: BBox;
  /** 坐标系的位置大小 */
  public coordinateBBox: BBox;

  public canvas: ICanvas;

  // 三层 Group 图层
  /** 背景层 */
  protected backgroundGroup: IGroup;
  /** 中间层 */
  protected middleGroup: IGroup;
  /** 前景层 */
  protected foregroundGroup: IGroup;

  /** 标记 view 的大小位置范围，均是 0 ~ 1 范围，便于开发者使用 */
  protected region: Region;
  /** view 的 padding 大小 */
  protected padding: Padding;
  /** 主题配置 */
  protected themeObject: object;

  // 配置信息存储
  protected options: Options = {
    data: [],
    components: [],
  }; // 初始化为空

  // 过滤之后的数据
  protected filteredData: Data;

  /** 所有的 scales */
  protected scales: Record<string, Scale> = {};

  // 布局函数
  protected layoutFunc: Layout = defaultLayout;
  // 生成的坐标系实例
  protected coordinateInstance: Coordinate;
  // 分面类实例
  protected facetInstance: Facet;

  constructor(props: ViewCfg) {
    super();

    const {
      parent,
      canvas,
      backgroundGroup,
      middleGroup,
      foregroundGroup,
      region = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      padding = 0,
      theme,
      options,
    } = props;

    this.parent = parent;
    this.canvas = canvas;
    this.backgroundGroup = backgroundGroup;
    this.middleGroup = middleGroup;
    this.foregroundGroup = foregroundGroup;
    this.region = region;
    this.padding = padding;
    this.themeObject = mergeTheme({}, theme);
    // 接受父 view 传入的参数
    this.options = { ...this.options, ...options };

    this.initial();
  }

  /**
   * 添加一个组件到画布
   * @param component
   * @param layer
   * @param direction
   * @param type
   */
  public addComponent(
    component: Component,
    layer: LAYER = LAYER.MID,
    direction: DIRECTION = DIRECTION.BOTTOM,
    type: ComponentType = ComponentType.OTHER
  ) {
    this.options.components.push({
      component,
      layer,
      direction,
      type,
    });
  }

  /**
   * 添加一个 geometry 到画布
   * @param geometry
   */
  public addGeometry(geometry: Geometry) {
    this.geometries.push(geometry);
  }

  /**
   * 设置 layout 函数
   * @param layout
   */
  public setLayout(layout: Layout) {
    this.layoutFunc = layout;
  }

  /**
   * 初始化
   */
  public initial() {
    // 将相对的 region 范围转化为实际的范围
    this.initialViewBBox();

    // 事件委托机制
    this.initialEvents();

    // 初始化数据
    this.initialData();

    // 初始化子 view
    this.initialViews();
  }

  /**
   * 渲染流程，渲染过程需要处理数据更新的情况
   * render 函数仅仅会处理 view 和子 view
   */
  public render() {
    this.emit(ViewLifeCircle.BEFORE_RENDER);
    // 递归渲染
    this.renderRecursive();
    this.emit(ViewLifeCircle.AFTER_RENDER);
    // 实际的绘图
    this.canvasDraw();
  }

  /**
   * 清空，之后可以再走 initial 流程，正常使用
   */
  public clear() {
    this.emit(ViewLifeCircle.BEFORE_CLEAR);
    // 1. 清空缓存和计算数据
    this.scales = {};
    this.filteredData = [];
    this.coordinateInstance = undefined;

    // 2. 清空 geometries
    _.each(this.geometries, (geometry: Geometry) => {
      geometry.clear();
    });
    this.geometries = [];

    // 3. 清空 components
    _.each(this.options.components, (co: ComponentOption) => {
      co.component.destroy();
    });
    // 清空
    this.options.components.splice(0);

    // 4. 递归处理子 view
    _.each(this.views, (view: View) => {
      view.clear();
    });

    this.emit(ViewLifeCircle.AFTER_CLEAR);
  }

  /**
   * 销毁，完全无法使用
   */
  public destroy() {
    // 销毁前事件，销毁之后已经没有意义了，所以不抛出事件
    this.emit(ViewLifeCircle.BEFORE_DESTROY);

    this.clear();

    this.backgroundGroup.remove(true);
    this.middleGroup.remove(true);
    this.foregroundGroup.remove(true);
  }
  /* end 生命周期函数 */

  /**
   * 装载数据。
   */
  public data(data: Data): View {
    _.set(this.options, 'data', data);

    return this;
  }

  /**
   * 数据筛选配置
   */
  public filter(field: string, condition: FilterCondition): View {
    _.set(this.options, ['filters', field], condition);

    return this;
  }

  /**
   * 坐标轴配置
   */
  public axis(field: string, axisOption: AxisOption): View {
    _.set(this.options, ['axes', field], axisOption);

    return this;
  }

  /**
   * 图例配置
   */
  public legend(field: string, legendCfg): View {
    _.set(this.options, ['legends', field], legendCfg);

    return this;
  }

  /**
   * scale 配置
   */
  public scale(field: string, scaleOption: ScaleOption): View {
    _.set(this.options, ['scales', field], scaleOption);

    return this;
  }

  /**
   * tooltip 配置
   */
  public tooltip(visible: boolean): View {
    _.set(this.options, 'tooltip', visible);

    return this;
  }

  /**
   * 辅助标记配置
   */
  public annotation(): View {
    return this;
  }

  /**
   * 坐标系配置
   */
  public coordinate(option: CoordinateOption): Coordinate;
  public coordinate(type: string, coordinateCfg?: CoordinateCfg): Coordinate;
  public coordinate(type: string | CoordinateOption, coordinateCfg?: CoordinateCfg): Coordinate {
    // 提供语法糖，使用更简单
    if (_.isString(type)) {
      _.set(this.options, 'coordinate', { type, cfg: coordinateCfg } as CoordinateOption);
    } else {
      _.set(this.options, 'coordinate', type);
    }

    // 创建一个 coordinate 实例
    this.createCoordinate();

    return this.coordinateInstance;
  }

  /**
   * view 分面绘制
   * @param type
   * @param cfg
   */
  public facet<T extends keyof FacetCfgMap>(type: T, cfg: FacetCfgMap[T]) {
    // 先销毁掉之前的分面
    if (this.facetInstance) {
      this.facetInstance.destroy();
    }

    // 创建新的分面
    const Ctor = getFacet(type);

    if (!Ctor) {
      throw new Error(`facet '${type}' is not exist!`);
    }

    this.facetInstance = new Ctor(this, { ...cfg, type });

    return this;
  }

  public animate(): View {
    return this;
  }

  /**
   * 设置主题
   */
  public theme(theme: string | object): View {
    this.themeObject = mergeTheme(this.themeObject, theme);

    return this;
  }

  /* end 一系列传入配置的 API */

  /**
   * 加载自定义交互
   * @param name 交互的名称（唯一）
   * @param interaction 交互类，view 中会对他们进行实例化和销毁
   */
  public interaction(name: string, interaction: Interaction): View {
    const path = ['interactions', name];

    const existInteraction = _.get(this.options, path) as Interaction;
    // 存在则先销毁已有的
    if (existInteraction) {
      existInteraction.destroy();
    }

    // 保存新的 interaction
    _.set(this.options, ['interactions', name], interaction);

    return this;
  }

  /**
   * 修改数据，数据更新逻辑
   * 因为数据更新仅仅影响当前这一层的 view
   * @param data
   */
  public changeData(data: Data) {
    this.emit(ViewLifeCircle.BEFORE_CHANGE_DATA);
    // 1. 保存数据
    this.data(data);
    // 2. 过滤数据
    this.filterData();
    // 3. 更新 geom 元素数据
    _.each(this.geometries, (geometry: Geometry) => {
      geometry.updateData(this.filteredData);
    });
    // 4. 调整 scale
    this.adjustScales();
    // 5. 更新组件
    this.renderComponents();
    // 6. 布局，计算每个组件的坐标、以及 coordinate 的范围
    this.doLayout();
    // 7. 布局之后，调整坐标系大小
    this.adjustCoordinate();
    // 8. 渲染几何标记
    this.paintGeometries();

    // 9. 遍历子 view 进行 change data
    _.each(this.views, (view: View) => {
      // FIXME 子 view 有自己的数据的情况，该如何处理？
      view.changeData(data);
    });

    this.emit(ViewLifeCircle.AFTER_CHANGE_DATA);
    // 绘图
    this.canvasDraw();
  }

  /* View 管理相关的 API */
  /**
   * 创建子 view
   */
  public createView(cfg?: Partial<ViewCfg>): View {
    // 子 view 共享 options 配置数据
    const sharedOptions = {
      data: this.options.data,
      scales: _.clone(this.options.scales),
      axes: _.clone(this.options.axes),
      coordinate: _.clone(this.options.coordinate),
    };

    const v = new View({
      parent: this,
      canvas: this.canvas,
      // 子 view 共用三层 group
      backgroundGroup: this.middleGroup.addGroup({ zIndex: GroupZIndex.BG }),
      middleGroup: this.middleGroup.addGroup({ zIndex: GroupZIndex.MID }),
      foregroundGroup: this.middleGroup.addGroup({ zIndex: GroupZIndex.FORE }),
      theme: this.themeObject,
      ...cfg,
      options: {
        ...sharedOptions,
        ...cfg.options,
      },
    });

    this.views.push(v);

    return v;
  }

  /**
   * 删除一个 view
   * @param view
   */
  public removeView(view: View): View {
    const removedView = _.remove(this.views, (v: View) => v === view)[0];

    if (removedView) {
      removedView.destroy();
    }

    return removedView;
  }
  /* end View 管理相关的 API */

  /**
   * 创建坐标系
   * @private
   */
  public createCoordinate(bbox?: BBox) {
    this.coordinateInstance = createCoordinate(this.options.coordinate, bbox || this.viewBBox);
  }

  // 一些 get 方法

  /**
   * 获取坐标系
   */
  public getCoordinate() {
    return this.coordinateInstance;
  }

  public getTheme(): object {
    return this.themeObject;
  }

  /**
   * 获得 x 轴字段的 scale 实例
   */
  public getXScale(): Scale {
    // 拿第一个 Geometry 的 X scale
    // 隐藏逻辑：一个 view 中的 Geometry 必须 x 字段一致
    const g = this.geometries[0];
    return g ? g.getXScale() : null;
  }

  /**
   * 获取 y 轴字段的 scales 实例
   */
  public getYScales(): Scale[] {
    // 拿到所有的 Geometry 的 Y scale，然后去重
    return _.uniq(_.map(this.geometries, (g: Geometry) => g.getYScale()));
  }

  /**
   * 返回所有配置信息
   */
  public getOptions(): Options {
    return this.options;
  }

  /**
   * 获取 view 的数据（过滤后的数据）
   */
  public getData() {
    return this.options.data;
  }

  /**
   * 获得绘制的层级 group
   * @param layer
   */
  public getLayer(layer: LAYER): IGroup {
    return layer === LAYER.BG
      ? this.backgroundGroup
      : layer === LAYER.MID
      ? this.middleGroup
      : layer === LAYER.FORE
      ? this.foregroundGroup
      : this.foregroundGroup;
  }

  /**
   * 获得所有的 legend 对应的 attribute 实例
   */
  public getLegendAttributes(): Attribute[] {
    // FIXME util 中 flatten 的类型定义不正确
    return (_.flatten(_.map(this.geometries, (g: Geometry) => g.getLegendAttributes())) as unknown) as Attribute[];
  }

  /**
   * 获取所有的分组字段的 scales
   */
  public getGroupScales(): Scale[] {
    // 拿到所有的 Geometry 的 分组字段 scale，然后打平去重
    const scales = _.map(this.geometries, (g: Geometry) => g.getGroupScales());
    return _.uniq(_.flatten(scales));
  }

  public getCanvas(): ICanvas {
    let v = this as View;

    while (true) {
      if (v.parent) {
        v = v.parent;
        continue;
      }
      break;
    }
    return ((v as unknown) as Chart).canvas;
  }

  /**
   * 递归 render views
   * 步骤非常繁琐，因为之间有一些数据依赖，所以执行流程上有先后关系
   */
  protected renderRecursive() {
    // 1. 处理数据
    this.filterData();
    // 2. 创建 coordinate 实例
    if (!this.coordinateInstance) {
      this.createCoordinate();
    }
    // 3. 初始化 Geometry
    this.initialGeometries();
    // 4. 调整 scale 配置
    this.adjustScales();
    // 5. 渲染组件 component
    this.renderComponents();
    // 6.  递归 views，进行布局
    this.doLayout();
    // 7. 渲染分面
    this.renderFacet();
    // 8. 布局完之后，coordinate 的范围确定了，调整 coordinate 组件
    this.adjustCoordinate();
    // 9. 渲染几何标记
    this.paintGeometries();

    // 同样递归处理子 views
    _.each(this.views, (view: View) => {
      view.renderRecursive();
    });
  }
  // end Get 方法

  // 生命周期子流程——初始化流程
  /**
   * 初始化 region，计算实际的像素范围坐标，去除 padding 之后的
   * @private
   */
  private initialViewBBox() {
    // 存在 parent， 那么就是通过父容器大小计算
    let width;
    let height;
    let start: Point;

    if (this.parent) {
      start = this.parent.coordinateBBox.tl;
      width = this.parent.coordinateBBox.width;
      height = this.parent.coordinateBBox.height;
    } else {
      // 顶层容器，从 canvas 中取值 宽高
      width = this.canvas.get('width');
      height = this.canvas.get('height');
      start = { x: 0, y: 0 };
    }

    const region = this.region;

    const [top, right, bottom, left] = parsePadding(this.padding);

    // 计算 bbox 除去 padding 之后的
    this.viewBBox = this.coordinateBBox = new BBox(
      start.x + width * region.start.x + left,
      start.y + height * region.start.y + top,
      width * (region.end.x - region.start.x) - left - right,
      height * (region.end.y - region.start.y) - top - bottom
    );
  }

  /**
   * 初始化事件机制：G 4.0 底层内置支持 name:event 的机制，那么只要所有组件都有自己的 name 即可。
   *
   * G2 的事件只是获取事件委托，然后在 view 嵌套结构中，形成事件冒泡机制。
   * 当前 view 只委托自己 view 中的 Component 和 Geometry 事件，并向上冒泡
   * @private
   */
  private initialEvents() {
    // 三层 group 中的 shape 事件都会通过 G 冒泡上来的
    this.foregroundGroup.on('*', this.onEvents);
    this.middleGroup.on('*', this.onEvents);
    this.backgroundGroup.on('*', this.onEvents);
  }

  /**
   * 触发事件之后
   * @param evt
   */
  private onEvents = (evt: Event): void => {
    // 阻止继续冒泡
    evt.preventDefault();

    const { type } = evt;
    // 委托事件到 view 上
    this.emit(type, evt);

    if (this.parent) {
      // 事件在 view 嵌套中冒泡（暂不提供阻止冒泡的机制）
      this.parent.emit(type, evt);
    }
  };

  /**
   * 生成 controller 实例，后续更新配置
   * @private
   */
  private _initialControllers() {
    // 可能暂时不需要，组件管理直接使用 components 管理，生成逻辑写成工具函数
  }

  /**
   * 将不同的数据源，处理成 Data 定义的结构
   * @private
   */
  private initialData() {
    // 暂时只有一种数据结构，所以无需处理
  }

  /**
   * 遍历子 view，子 view 也进行初始化
   * @private
   */
  private initialViews() {
    _.each(this.views, (view: View) => {
      view.initial();
    });
  }

  // view 生命周期 —— 渲染流程
  /**
   * 处理筛选器，筛选数据
   * @private
   */
  private filterData() {
    const { data, filters } = this.options;
    // 不存在 filters，则不需要进行数据过滤
    if (_.size(filters) === 0) {
      this.filteredData = data;
      return;
    }

    // 存在过滤器，则逐个执行过滤，过滤器之间是 与 的关系
    this.filteredData = _.filter(data, (datum: Datum) => {
      let filtered = true;

      _.each(filters, (filter: FilterCondition, field: string) => {
        // 只要一个不通过，就结束循环，并过滤掉
        if (!filter(datum[field], datum)) {
          filtered = false;
          // return false === break loop
          return false;
        }
      });

      return filtered;
    });
  }

  /**
   * 初始化 Geometries
   * @private
   */
  private initialGeometries() {
    // 实例化 Geometry，然后 view 将所有的 scale 管理起来
    _.each(this.geometries, (geometry: Geometry) => {
      // 使用 coordinate 引用，可以保持 coordinate 的同步更新
      geometry.coordinate = this.getCoordinate();
      geometry.scaleDefs = _.get(this.options, 'scales', {});
      geometry.data = this.filteredData;
      geometry.theme = this.themeObject;
      // 保持 scales 引用不要变化
      geometry.scales = this.scales;

      geometry.initial();
    });
  }

  /**
   * 调整 scale 配置
   * @private
   */
  private adjustScales() {
    // 调整目前包括：
    // 分类 scale，调整 range 范围
    this.adjustCategoryScaleRange();
  }

  /**
   * 调整分类 scale 的 range，防止超出坐标系外面
   * @private
   */
  private adjustCategoryScaleRange() {
    const xyScales = [this.getXScale(), ...this.getYScales()].filter((e) => !!e);
    const coordinate = this.getCoordinate();
    const scaleOptions = this.options.scales;

    _.each(xyScales, (scale: Scale) => {
      // @ts-ignore
      const { field, values, isCategory, isIdentity } = scale;

      // 分类或者 identity 的 scale 才进行处理
      if (isCategory || isIdentity) {
        // 存在 value 值，且用户没有配置 range 配置
        if (values && !_.get(scaleOptions, [field, 'range'])) {
          const count = values.length;
          let range;

          if (count === 1) {
            range = [0.5, 1]; // 只有一个分类时,防止计算出现 [0.5,0.5] 的状态
          } else {
            let widthRatio = 1;
            let offset = 0;

            if (isFullCircle(coordinate)) {
              if (!coordinate.isTransposed) {
                range = [0, 1 - 1 / count];
              } else {
                widthRatio = _.get(this.theme, 'widthRatio.multiplePie', 1 / 1.3);
                offset = (1 / count) * widthRatio;
                range = [offset / 2, 1 - offset / 2];
              }
            } else {
              offset = 1 / count / 2; // 两边留下分类空间的一半
              range = [offset, 1 - offset]; // 坐标轴最前面和最后面留下空白防止绘制柱状图时
            }
          }
          // 更新 range
          scale.range = range;
        }
      }
    });
  }

  /**
   * 根据 options 配置、Geometry 字段配置，自动渲染 components
   * @private
   */
  private renderComponents() {
    const { axes, legends } = this.options;

    // 清空 ComponentOptions 配置
    this.options.components.splice(0);

    this.backgroundGroup.clear();
    this.foregroundGroup.clear();

    // 1. axis
    // 根据 Geometry 的字段来创建 axis
    _.each(createAxes(axes, this), (axis: ComponentOption) => {
      const { component, layer, direction, type } = axis;
      this.addComponent(component, layer, direction, type);
    });

    // 2. legend
    // 根据 Geometry 的字段来创建 legend
    _.each(createLegends(legends, this), (legend: ComponentOption) => {
      const { component, layer, direction, type } = legend;
      this.addComponent(component, layer, direction, type);
    });
  }

  private doLayout() {
    this.layoutFunc(this);
  }

  /**
   * 调整 coordinate 的坐标范围
   * @private
   */
  private adjustCoordinate() {
    this.coordinateInstance.update({
      start: this.coordinateBBox.bl,
      end: this.coordinateBBox.tr,
    });
  }

  /**
   * 根据 options 配置自动渲染 geometry
   * @private
   */
  private paintGeometries() {
    // geometry 的 paint 阶段
    this.geometries.map((geometry: Geometry) => {
      geometry.paint();
    });
  }

  /**
   * 渲染分面，会在其中进行数据分面，然后进行子 view 创建
   */
  private renderFacet() {
    if (this.facetInstance) {
      this.facetInstance.render();
    }
  }

  /**
   * canvas.draw 实际的绘制
   * @private
   */
  private canvasDraw() {
    this.getCanvas().draw();
  }
}

/**
 * 注册 geometry 组件
 * @param name
 * @param Ctor
 */
export const registerGeometry = (name: string, Ctor: any) => {
  // 语法糖，在 view API 上增加原型方法
  View.prototype[name.toLowerCase()] = function(cfg: any = {}) {
    const props = {
      /** 图形容器 */
      container: this.middleGroup.addGroup(),
      // 其他信息，不知道需不需要
      canvas: this.canvas,
      ...cfg,
    };

    const geometry = new Ctor(props);
    this.addGeometry(geometry);

    return geometry;
  };
};
