# Text

文字是传达信息最传统的方式，`Text` 标记具备有大量的视觉映射通道：`x`，`y`，`color`，`fontSize`，`rotate` 等，除此之外，还有大量的文本样式相关的配置，可以通过可视化映射的方式，让文本可视化具备有更强的表达性。一般用于几个场景：

- 文本可视化
- 数据的标注和辅助

## 快速开始

绘制一个简单的柱形图，然后使用 `Text` 标记去绘制数据标签，辅助看数。

```js
(() => {
  const chart = new G2.Chart();

  chart.data([
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ]);

  chart
    .interval()
    .encode('x', 'genre')
    .encode('y', 'sold')
    .encode('color', 'genre');

  chart
    .text()
    .encode('x', 'genre')
    .encode('y', 'sold')
    .encode('text', 'sold')
    .style('fill', 'black')
    .style('textAlign', 'center')
    .style('dy', -5);

  return chart.render().node();
})();
```

## API

`Text` 对应的 shape 图形有以下：

| shape | 描述                                   | 示例                                                                                                                 |
| ----- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| text  | 文本，具备有丰富的文本可视化属性配置   | <img alt="text shape" height="32" src="https://gw.alipayobjects.com/zos/antfincdn/tJs9C9JWMP/20220927172133.jpg" />  |
| badge | 图形，水滴形状的图形，常用于数据的标注 | <img alt="badge shape" height="32" src="https://gw.alipayobjects.com/zos/antfincdn/uiQzZkyTGJ/20220927172207.jpg" /> |

### Text 样式配置

| 参数        | 说明                             | 类型               | 默认值 |
| ----------- | -------------------------------- | ------------------ | ------ |
| connector   | 文本和目标点之间的连接线样式配置 | `PathStyleProps`   | -      |
| startMarker | 指定生成权重数组的通道           | `MarkerStyleProps` | -      |
| endMarker   | 聚合每一组权重的函数             | `MarkerStyleProps` | -      |
| background  | 聚合每一组权重的函数             | `RectStyleProps`   | -      |

### Badge 样式配置

| 参数      | 说明                           | 类型                                                        | 默认值 |
| --------- | ------------------------------ | ----------------------------------------------------------- | ------ |
| size      | 图形的大小                     | `PathStyleProps`                                            | -      |
| symbol    | 图形的样式，默认为水滴 💧 形状 | `string` \| `((x: number, y: number, r: number) => string)` | -      |
| textStyle | 图形上文字的样式               | `TextStyleProps`                                            | -      |

## 使用方式

`Text` 标记主要用于两种场景：文本数据可视化，以及图表上的文本标注。

### 文本可视化

首先来一个`词云图`，它是文本可视化最典型的场景了。

```js
(() => {
  const words = () => {
    return (data) =>
      data.flatMap((d) =>
        d.words.map(({ weight, word }) => ({
          value: weight,
          text: word,
          name: d.name,
        })),
      );
  };

  const width = 640;
  const height = 480;
  const chart = new G2.Chart({
    width,
    height,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  });

  chart
    .text()
    .data({
      type: 'fetch',
      value:
        'https://gw.alipayobjects.com/os/bmw-prod/d345d2d7-a35d-4d27-af92-4982b3e6b213.json',
      transform: [
        { type: words },
        { type: 'wordCloud', size: [width, height] },
      ],
    })
    .encode('x', 'x')
    .encode('y', 'y')
    .encode('text', 'text')
    .encode('color', 'text')
    .encode('rotate', 'rotate')
    .encode('fontSize', 'size')
    .encode('title', 'name')
    .encode('tooltip', (d) => d.value.toFixed(2))
    .style('textAlign', 'center')
    .scale('x', { domain: [9, width], range: [0, 1] })
    .scale('y', { domain: [0, height], range: [0, 1] })
    .axis(false)
    .scale('fontSize', { type: 'identity' })
    .scale('rotate', { type: 'identity' })
    .scale('tooltip', { type: 'identity' });

  return chart.render().node();
})();
```

除了词云图外，还可以做一些文本段落在画布上的排版和可视化，举个例子：

```js
(() => {
  const paragraph = [
    'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.',

    'There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.',

    'Circumambulate the city of a dreamy Sabbath afternoon. Go from Corlears Hook to Coenties Slip, and from thence, by Whitehall, northward. What do you see?—Posted like silent sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean reveries. Some leaning against the spiles; some seated upon the pier-heads; some looking over the bulwarks of ships from China; some high aloft in the rigging, as if striving to get a still better seaward peep. But these are all landsmen; of week days pent up in lath and plaster—tied to counters, nailed to benches, clinched to desks. How then is this? Are the green fields gone? What do they here?',
  ].map((text, idx) => ({ idx, text }));

  const chart = new G2.Chart({
    width: 640,
    height: 320,
  });

  chart.data(paragraph);

  // Draw paragraph number.
  chart
    .text()
    .encode('x', 'idx')
    .encode('y', 1)
    .encode('text', 'idx')
    .scale('x', { type: 'band' })
    .scale('y', { domain: [0, 1] })
    .axis(false)
    .style('wordWrap', true)
    .style('wordWrapWidth', 160) // width / 3
    .style('dx', -80) // -1 * wordWrapWidth / 2
    .style('dy', -20)
    .style('textAlign', 'left')
    .style('textBaseline', 'top')
    .style('fontSize', 12)
    .style('background', {
      fill: '#416180',
      fillOpacity: 0.05,
      radius: 3,
      padding: [2, 4],
    });

  // Draw paragraph text.
  chart
    .text()
    .encode('x', 'idx')
    .encode('y', 1)
    .encode('text', 'text')
    .encode('color', '#1b1e23')
    .scale('x', { type: 'band' })
    .scale('y', { domain: [0, 1] })
    .axis(false)
    .style('wordWrap', true)
    .style('wordWrapWidth', 160) // width / 3
    .style('dx', -80) // -1 * wordWrapWidth / 2
    .style('textAlign', 'left')
    .style('textBaseline', 'top')
    .style('fontSize', 10)
    .style('lineWidth', 0);

  return chart.render().node();
})();
```

### Text 标记

`Text` 标记除了用在文本可视化之外，还经常用于文本信息的标注，下面举几个标注的例子。

```js
(() => {
  const chart = new G2.Chart({
    height: 300,
    width: 640,
  });

  chart.data({
    type: 'fetch',
    value:
      'https://gw.alipayobjects.com/os/antvdemo/assets/data/blockchain.json',
    transform: [
      {
        type: 'fold',
        fields: ['blockchain', 'nlp'],
        as: ['type', 'value'],
      },
    ],
  });

  chart
    .line()
    .encode('x', (d) => new Date(d.date))
    .encode('y', 'value')
    .encode('color', 'type')
    .axis('x', { label: { autoHide: 'greedy', showLast: false } });

  chart
    .text()
    .data([{ date: '2017-12-17', value: 100 }])
    .encode('x', (d) => new Date(d.date))
    .encode('y', 'value')
    .encode(
      'text',
      (d) => `${d.date}, 受比特币影响，blockchain 搜索热度达到峰值：${d.value}`,
    )
    .style('wordWrap', true)
    .style('wordWrapWidth', 160)
    .style('fill', '#2C3542')
    .style('fillOpacity', 0.65)
    .style('textAlign', 'left')
    .style('dy', 30)
    .style('dx', -174)
    .style('fontSize', 10)
    .style('lineWidth', 0)
    .style('background', {
      fill: '#416180',
      fillOpacity: 0.15,
      radius: 2,
      padding: [2, 4],
    })
    .style('connector', {
      stroke: '#416180',
      strokeOpacity: 0.45,
    });

  return chart.render().node();
})();
```

通过文本标注，我们可以讲一些信息附加在图形上，让用户能快速从可视化图表上拿到洞察信息。

### Badge 图形标注

除了使用文本标注之外，也可以增加一个图形标注，让标注形态更加丰富一些，入例如下面的水滴样式的标注。

```js
(() => {
  const chart = new G2.Chart({
    height: 300,
    width: 640,
  });

  chart.data({
    type: 'fetch',
    value:
      'https://gw.alipayobjects.com/os/antvdemo/assets/data/blockchain.json',
    transform: [
      {
        type: 'fold',
        fields: ['blockchain', 'nlp'],
        as: ['type', 'value'],
      },
    ],
  });

  chart
    .line()
    .encode('x', (d) => new Date(d.date))
    .encode('y', 'value')
    .encode('color', 'type')
    .axis('x', { label: { autoHide: 'greedy', showLast: false } });

  chart
    .text()
    .data([{ date: '2017-12-17', value: 100 }])
    .encode('x', (d) => new Date(d.date))
    .encode('y', 'value')
    .encode('text', (d) => d.value)
    .encode('shape', 'badge')
    .style('fill', '#6395FA')
    .style('fillOpacity', 0.55)
    .style('textStyle', { fill: 'red' });

  return chart.render().node();
})();
```

## FAQ
