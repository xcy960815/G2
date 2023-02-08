---
title: elementHighlightByX
---

高亮和鼠标悬浮的元素拥有相同 x 通道值的元素。

## 开始使用

<img alt="example" src="https://gw.alipayobjects.com/zos/raptor/1670298045860/element-highlight-by-x.gif" width="640">

```ts
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  paddingLeft: 50,
});

chart
  .interval()
  .data({
    type: 'fetch',
    value:
      'https://gw.alipayobjects.com/os/bmw-prod/f129b517-158d-41a9-83a3-3294d639b39e.csv',
    format: 'csv',
  })
  .transform({ type: 'sortX', by: 'y', reverse: true, slice: 6 })
  .transform({ type: 'dodgeX' })
  .encode('x', 'state')
  .encode('y', 'population')
  .encode('color', 'age')
  .axis('y', { labelFormatter: '~s' });

chart.interaction('elementHighlightByX', {
  highlightedFill: 'red',
  unhighlightedOpacity: 0.5,
});

chart.render();
```

## 选项

| 属性                         | 描述             | 类型                           | 默认值 |
| ---------------------------- | ---------------- | ------------------------------ | ------ |
| `highlighted${StyleAttrs}`   | 强调元素的样式   | `number             \| string` | -      |
| `unhighlighted${StyleAttrs}` | 非强调元素的样式 | `number             \| string` | -      |
