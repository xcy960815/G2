---
title: 配置图表主题
order: 10
---

G2 在绘图时，首先确定数据是如何展示的，然后再通过主题系统对细节进行控制。在 G2 中主题控制着图表的非数据元素外观，它不能改变图表的感官性质，**但是可以使图表变得更具美感**，满足整体一致性的要求，包括图表的坐标轴、图例、网格线等的样式及几何标记的颜色搭配等。

我们可以在 G2 中：

1. 使用内置主题
1. 修改内置主题的某些元素
1. 注册自定义主题

## 使用内置主题

G2 4.0 默认提供了一种内置主题，命名为 'default'，如果内置了多个主题的话，可以使用以下方法对主题进行切换或者修改内置主题。

1. 在初始化 chart 时指定

```typescript
const chart1 = new Chart({
  container: 'container',
  theme: 'dark', // 使用命名为 'dark' 的主题
});

const chart2 = new Chart({
  container: 'container',
  theme: {
    defaultColor: 'red',
  }, // 修改内置主题的某些配置
});
```

2. 通过 `chart.theme()`  接口配置

```typescript
// 在创建图表的时候，就切换主题
chart1.theme('dark');
chart1.render(); // 渲染图表

// 图表渲染后，动态切换主题
chart2.theme({
  defaultColor: 'red',
}); // 修改内置主题的某些配置
chart2.render(true);
```

**重要**

`chart.theme()` 声明之后，必须调用 `chart.render()` / `chart.render(true)` 方可生效，如果是动态切换主题场景，建议调用 `chart.render(true)`。

3. 在 view 上配置主题

```typescript
// 在创建 view 的时候声明主题
const view1 = chart.createView({
  theme: 'dark',
});
// 在创建 view 的时候修改主题
const view2 = chart.createView({
  theme: {
    defaultColor: 'red',
  },
});

// 通过 theme() 接口声明
view1.theme('dark');

view2.theme({
  defaultColor: 'red',
});
```

**重要**

`view.theme()` 声明之后，必须调用 `chart.render()` / `chart.render(true)` 方可生效，如果是动态切换主题场景，建议调用 `chart.render(true)`

4. 在 Geometry 上配置主题

```typescript
chart
  .interval({
    theme: {
      defaultColor: 'red',
    },
  })
  .position('x*y');
```

**即 G2 支持分别在 chart, view 以及 geometry 上配置主题，这三者的优先顺序为：geometry > view > chart。**

## 注册自定义主题

🌰 一个简单的例子：

```typescript
import { registerTheme } from '@antv/g2';

registerTheme('themeName', {}); // 注册名为 'themeName' 的全新的主题结构
```

2. 使用注册主题

```typescript
chart.theme('themeName');
```

关于自定义主题的具体使用，请阅读[自定义主题](../developer/registertheme)。
