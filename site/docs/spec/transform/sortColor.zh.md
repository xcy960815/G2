---
title: sortColor
order: 1
---

对离散的 color 比例尺的定义域根据指定通道排序。

## 开始使用

案例可以参考 [sortX](/api/transform/sortX)，下面是伪代码示意。

```ts
chart
  .interval()
  // ...
  .transform({
    type: 'sortColor',
    /* options */
  });
```

## 选项

| 属性               | 描述                                           | 类型                               | 默认值                 |
|-------------------|------------------------------------------------|-----------------------------------|-----------------------|
| reverse           | 是否逆序                                        | `boolean`                        | `false`               |  
| by                | 指定排序的通道                                   | `string`                          | `y`                   |
| slice             | 选择一个分片范围                                  | `number \| [number, number]`      | `y`                   |
| reducer           | 分组聚合，用于比较大小                             | `Reducer`                         | `max`                 |

```ts
type Primitive = number | string | boolean | Date;

type Reducer =
  | 'max'
  | 'min'
  | 'sum'
  | 'first'
  | 'last'
  | 'mean'
  | 'median'
  | ((I: number[], V: Primitive[]) => Primitive);
```
