---
title: 概览
order: 1
---

G2 是一个简洁的、渐进式的可视化语法。文档将按照下面的顺序去分别介绍每一个模块，你可以把它当做一个字典去搜索和查询。

* [Overview](./overview) - 所有 API 文档的一句话概览。
* [Chart](./chart) - 提供简洁的命令式 API，一句话生成一个图表。
* [Data](./data/overview) - 介绍不同载入数据的方式和数据变换。
  * [data.sortBy](./scale/sortBy) - 
  * [data.filterBy](./scale/filterBy) - 
  * [data.fold](./scale/fold) - 
  * [data.lookup](./scale/lookup) - 
  * [data.map](./scale/map) - 
  * [custom](./scale/custom) - 
* Mark - 介绍不同图形标记 mark 的配置和用法。
  * [mark.interval](/api/mark/interval) - 通常用来绘制柱、条形图，饼图等相关图表。
  * [mark.point](/api/mark/point) - 主要用于绘制散点图，利用点的粒度来分析数据的分布情况。
  * [mark.line](/api/mark/line) - 根据一系列的点，绘制折线，通常用来绘制折线图。
  * [mark.area](/api/mark/area) - 通常用来绘制我们常见的面积图，通过填充，可以更好突出趋势堆积信息。
  * [mark.cell](/api/mark/cell) - 根据 x, y 将空间划分成一个子空间，然后进行可视化绘制。
  * [mark.rect](/api/mark/rect) - 使用两组 x，两组 y 来定位一个矩形区域，常用于直方图、矩阵树图、聚合热力图等。
  * [mark.link](/api/mark/link) - 标记使用两个用 (x, y) 定位的点，绘制一条带方向的直线。通过指定 `x`，`y` 通道为长度为 2 的字段数组即可。
  * [mark.vector](/api/mark/vector) - 用 `start`，`end` 两个点来表示一个向量，通常用于绘制具备向量含义的数据，比如风向量场等。
  * [mark.polygon](/api/mark/polygon) - 利用多组 (x, y) 数据点，在画布中绘制闭合的多边形，通常结合一些社区布局算法使用。
  * [mark.box](/api/mark/box) - 用来绘制箱线图，通常用来展示一组数据分布情况的统计图。
  * [mark.boxplot](./mark/boxplot) - 
  * [mark.text](/api/mark/text) - 通过指定文本的样式通道，可以在画布上绘制和数据绑定的文本字符。
  * [mark.image](/api/mark/image) - 利用 `src` 通道在画布上绘制图片。
  * [mark.shape](./mark/shape) - 
  * [mark.interval](./mark/interval) - 
  * [mark.lineX](./mark/lineX) - 
  * [mark.lineY](./mark/lineY) - 
  * [mark.range](./mark/range) - 
  * [mark.rangeX](./mark/rangeX) - 
  * [mark.rangeY](./mark/rangeY) - 
  * [mark.sankey](./mark/sankey) - 
  * [mark.treemap](./mark/treemap) - 
  * [mark.pack](./mark/pack) - 
  * [mark.forceGraph](./mark/forceGraph) - 
  * [mark.tree](./mark/tree) - 
  * [mark.wordcloud](./mark/wordcloud) - 
* Transform - 对视觉通道 encode 进行变换。
  * [transform.bin](/api/transform/bin) - 对连续的 x 和 连续的 y 通道进行分箱，并且对通道根据指定的 redcuer 进行聚合。
  * [transform.binX](/api/transform/binx) - 对 x 通道进行分箱，如果希望对 y 通道进行分箱，使用 binX + transpose 坐标系。
  * [transform.diffY](/api/transform/diffy) - 对 y 和 y1 通道求差集。
  * [transform.dodgeX](/api/transform/dodgex) - 生成 series 通道值为 color 通道的值，根据 series 通道实现分组效果。
  * [transform.flexX](/api/transform/flexx) - 根据指定通道设置 x 比例尺的 flex 属性，实现不等宽矩形的效果。
  * [transform.group](/api/transform/group) - 对离散的 x 和 连续的 y 通道进行分组，并且对通道根据指定的 Redcuer 进行聚合。
  * [transform.groupColor](/api/transform/groupcolor) - 对离散的 color 通道进行分组，并且对通道根据指定的 Redcuer 进行聚合。
  * [transform.groupX](/api/transform/groupx) - 对离散的 x 通道进行分组，并且对通道根据指定的 Redcuer 进行聚合。
  * [transform.groupY](/api/transform/groupy) - 对离散的 y 通道进行分组，并且对通道根据指定的 Redcuer 进行聚合。
  * [transform.jitter](/api/transform/jitter) - 根据离散的 x 和 离散的 y 比例尺，生成 dy 和 dx 通道，实现在某个区域散开的效果。
  * [transform.jitterX](/api/transform/jitterx) - 根据离散的 x 比例尺，生成 dx 通道，实现在某个区域的 x 方向散开的效果。
  * [transform.normalizeY](/api/transform/normalizey) - 对 y 和 y1 通道根据指定的 basis 进行归一化处理。
  * [transform.select](/api/transform/select) - 按照指定通道进行分组，根据指定通道和 selector 从每组选择出数据。
  * [transform.selectX](/api/transform/selectx) - 按照指定通道进行分组，根据 x 通道和 selector 从每组选择出数据。
  * [transform.selectY](/api/transform/selecty) - 按照指定的通道进行分组，根据 y 通道和 selector 从每组选择出数据。
  * [transform.pack](/api/transform/pack) - 生成 transform 和 scale 属性，从而让图形在空间中紧凑排列。
  * [transform.sortColor](/api/transform/sortcolor) - 对离散的 color 比例尺的定义域根据指定通道排序。
  * [transform.sortX](/api/transform/sortx) - 对离散的 x 比例尺的定义域根据指定通道排序。
  * [transform.sortY](/api/transform/sorty) - 对离散的 y 比例尺的定义域根据指定通道排序。
  * [transform.stackEnter](/api/transform/stackenter) - 对 enterDuration 和 enterDelay 通道进行堆叠，实现分组动画的效果。
  * [transform.stackY](/api/transform/stacky) - 按照指定通道分组，对每组的 y 和 y1 通道进行堆叠，实现堆叠效果。
  * [transform.symmetryY](/api/transform/symmetryy) - 按照指定通道分组，给每组的 y 和 y1 通道添加偏移，实现对称效果。
* Scale - 比例尺相关的介绍
  * [scale.linear](/api/scale/linear) - 针对连续数据，对数据进行连续映射的比例尺。
  * [scale.sqrt](/api/scale/sqrt) - 指数固定为 `0.5` 的 `pow` 比例尺。
  * [scale.pow](/api/scale/pow) - 类似于 `linear` 比例尺，但是映射函数为指数函数（exponential）。
  * [scale.log](/api/scale/log) - 类似于 `linear` 比例尺，但是映射函数为对数函数（logarithmic）。
  * [scale.ordinal](/api/scale/ordinal) - 将离散的数据映射到另外一个离散数据中。
  * [scale.quantize](/api/scale/quantize) - 类似于 `threshold`，但是计算切片的方式是基于元素的数据值。
  * [scale.quantile](/api/scale/quantile) - 类似于 `threshold`， 但是计算切片的方式是基于元素在数据中的索引。
  * [scale.threshold](/api/scale/threshold) - 将连续的值域范围划分为多个切片，并将这些切片映射到一个离散的数据中。
* Coordinate - 坐标系相关的介绍。
  * [coordinate.polar](./scale/polar) - 
  * [coordinate.theta](./scale/theta) - 
  * [coordinate.radial](./scale/radial) - 
  * [coordinate.parallel](./scale/parallel) - 
  * [coordinate.transpose](./scale/transpose) - 
  * [coordinate.fisheye](./scale/fisheye) - 
* Composition - 视图复合相关的内容。
  * [spaceLayer](./scale/spaceLayer) - 
  * [spaceFlex](./scale/spaceFlex) - 
  * [facetRect](./scale/facetRect) - 
  * [facetCircle](./scale/facetCircle) - 
  * [repeatMatrix](./scale/repeatMatrix) - 
  * [timingKeyframe](./scale/timingKeyframe) - 
* Component - 图表组件相关的内容。
  * [axisX](./scale/axisX) - 
  * [axisY](./scale/axisY) - 
  * [legendCateogry](./scale/legendCateogry) - 
  * [legendContiuous](./scale/legendContiuous) - 
* Label - 数据标签相关的内容
  * [label.dodgeY](./scale/dodgeY) - 
  * [label.hideOverlap](./scale/hideOverlap) - 
  * [label.spider](./scale/spider) - 
  * [label.surround](./scale/surround) - 
* Animation - 动画相关的内容。
  * [animation.fadeIn](./scale/fadeIn) - 
  * [animation.fadeOut](./scale/fadeOut) - 
  * [animation.growInX](./scale/growInX) - 
  * [animation.growInY](./scale/growInY) - 
  * [animation.pathIn](./scale/pathIn) - 
  * [animation.scaleInX](./scale/scaleInX) - 
  * [animation.scaleInY](./scale/scaleInY) - 
  * [animation.scaleOutX](./scale/scaleOutX) - 
  * [animation.scaleOutY](./scale/scaleOutY) - 
  * [animation.waveIn](./scale/waveIn) - 
  * [animation.zoomIn](./scale/zoomIn) - 
  * [animation.zoomOut](./scale/zoomOut) - 
* Interaction - 交互相关内容。
* [Graph]() - 
* [Geo]() - 
* [Theme](./theme) - 主题相关内容。
* Plugin - 基于 G 插件相关的内容。
  * [rough](./plugin/rough) - 绘制手绘图的插件。
  * [lottie](./plugin/lottie) - 可以在图表中播放 lottie 动画的插件。