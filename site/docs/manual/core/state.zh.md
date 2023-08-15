---
title: 状态（State）
order: 6.9
---

G2 中**状态（State）** 主要用来控制标记的状态样式。这些状态会被交互触法，属性是 @antv/g 支持的样式属性。

```js
({
  type: 'interval',
  state: {
    active: { fill: 'red', stroke: 2 },
    inactive: { fill: '#aaa' },
  },
});
```

```js
// API
// 第一种方式
chart
  .interval()
  .state('active', { fill: 'red', stroke: 2 })
  .state('inactive', { fill: '#aaa' });

// 第二种方式
chart.interval().state({
  active: { fill: 'red', stroke: 2 },
  inactive: { fill: '#aaa' },
});
```

## 内置状态

目前一共有 4 个内置状态：

- active - 高亮时候的样式
- inactive - 没有高亮时候的样式
- selected - 选择时候的样式
- unselected - 没有选择时候的样式

## 高亮状态

```js | ob
(() => {
  const chart = new G2.Chart({ theme: 'classic', padding: 'auto' });

  chart
    .interval()
    .data({
      type: 'fetch',
      value:
        'https://gw.alipayobjects.com/os/bmw-prod/fb9db6b7-23a5-4c23-bbef-c54a55fee580.csv',
    })
    .encode('x', 'letter')
    .encode('y', 'frequency')
    .axis('y', { labelFormatter: '.0%' })
    .state('active', { fill: 'red' })
    .state('inactive', { fill: '#aaa' })
    .interaction('elementHighlight'); // 设置高亮交互

  chart.render();

  return chart.getContainer();
})();
```

## 选择状态

```js | ob
(() => {
  const chart = new G2.Chart({ theme: 'classic', padding: 'auto' });

  chart
    .interval()
    .data({
      type: 'fetch',
      value:
        'https://gw.alipayobjects.com/os/bmw-prod/fb9db6b7-23a5-4c23-bbef-c54a55fee580.csv',
    })
    .encode('x', 'letter')
    .encode('y', 'frequency')
    .axis('y', { labelFormatter: '.0%' })
    .state('selected', { fill: 'red' })
    .state('unselected', { fill: '#aaa' })
    .interaction('elementSelect'); // 设置选择交互

  chart.render();

  return chart.getContainer();
})();
```
