# Overview

There are some demos for [G2 5.0](https://github.com/antvis/G2/tree/v5).

## Layout

```js | dom "pin: false"
genji.preview([
  {
    title: 'Default Size',
    path: '/layout#default-size',
    thumbnail:
      'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*PkFmSKsjU5YAAAAAAAAAAAAAARQnAQ',
  },
  {
    title: 'Specified Size',
    path: '/layout#specified-size',
    thumbnail:
      'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*ZTC0QKYGe-EAAAAAAAAAAAAAARQnAQ',
  },
  {
    title: 'Padding',
    path: '/stack#stacked-area',
    thumbnail:
      'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*jddxSYkwWPEAAAAAAAAAAAAAARQnAQ',
  },
]);
```

## Transform

### Stack

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Stacked Interval',
      path: '/stack#stacked-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*jPIPR5pvUF0AAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Stacked Area',
      path: '/stack#stacked-area',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*5wrHTrQPryEAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Order By Sum',
      path: '/stack#order-by-sum',
      thumbnail:
        ' https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*FJPGS5v2-j8AAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Order By Value',
      path: '/stack#order-by-value',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*vfQhSLzqZXwAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Order By Max Index',
      path: '/stack#order-by-max-index',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*GlpWSIuxhpcAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Stacked Point',
      path: '/stack#stacked-point',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*x6KxRq_N2i0AAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

### Dodge

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Dodged Interval',
      path: '/dodge#dodged-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*S1lURbrnjLQAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Order By Value',
      path: '/dodge#order-by-value',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*4fYgT68yuIoAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Dodged Schema',
      path: '/dodge#dodged-schema',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*igdpTZKSp0UAAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

### Normalize

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Normalized Stacked Interval',
      path: '/normalize#normalized-stacked-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*j2EJSJ0pvvkAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Normalized Stacked Dodged Interval',
      path: '/normalize#normalized-stacked-dodged-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*Ex-_SL1hFswAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Normalized Stacked Area',
      path: '/normalize#normalized-stacked-area',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*jmWgQ7L8eyUAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Normalized Line',
      path: '/normalize#normalized-line',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*5kk0RqnkTdcAAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

### Symmetry

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Symmetry Stacked Area',
      path: '/symmetry#symmetry-stacked-area',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*JvVVTI5ASawAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Symmetry Interval',
      path: '/symmetry#symmetry-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*dx05SoJezooAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Symmetry Stacked Point',
      path: '/symmetry#symmetry-stacked-point',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*PSfjSZUa_nIAAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

### Jitter

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Jitter Both',
      path: '/jitter#jitter-both',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*-MaBTb6i7RQAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Jitter In Polar',
      path: '/jitter#jitter-in-polar',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*Z0BHQ6NBLT0AAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'JitterY',
      path: '/jitter#jittery',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*qSd7S56SzGMAAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

### Select

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Select',
      path: '/select#select',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*wJ1DSaMAZWcAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'SelectX',
      path: '/select#selectx',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*xRbfTLMwYXcAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'SelectY',
      path: '/select#selecty',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*5zEHTYNlmoAAAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

### Group

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'GroupX',
      path: '/group#groupX',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*R3_FSY2cH1oAAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

## Scale

> TODO

## Coordinate

> TODO

## Geometry

### Interval

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Basic Interval',
      path: '/interval#basic-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*8EqFQJkVXRsAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Flex Interval',
      path: '/interval#flex-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*jgO5Sasz4wAAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Transpose Interval',
      path: '/interval#transpose-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*RjFfRZ-Wn_8AAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Polar Interval',
      path: '/interval#polar-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*urWcSpWKLIAAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Polar+Transpose Interval',
      path: '/interval#polar+transpose-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*8qkRQYriWnsAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Polar+Transpose+StackY Interval',
      path: '/interval#polar+transpose+stacky-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*MlxPTp3rzOsAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'StackY Interval',
      path: '/interval#stacky-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*6SHHRoAglPQAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'DodgeX Interval',
      path: '/interval#dodgex-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*rzGqQbTyRMMAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'StackY+DodgeX Interval',
      path: '/interval#stacky+dodgex-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*d60tSob3IZEAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Range Interval',
      path: '/interval#range-interval',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*ewS_SrB20h4AAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

### Point

> TODO

### Line

> TODO

### Area

> TODO

### Grid

```js | dom "pin: false"
genji.preview([
  {
    title: 'Ordinal grid',
    path: '/grid#ordinal-grid',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/cfgJwjW2q4/3d55906c-5da8-41fd-a17c-80b6c504f2fd.png',
  },
  {
    title: 'Quantize grid',
    path: '/grid#quantize-grid',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/Z2mUdMCVJ2/294d37a9-4627-458d-beb2-c3a6e5049ca4.png',
  },
  {
    title: 'Flex grid',
    path: '/grid#flex-grid',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/Lz6kRwsXAr/dbb01680-a620-4e66-8e5f-3cb323c41ae7.png',
  },
]);
```

### Node & Edge

```js | dom "pin: false"
genji.preview([
  {
    title: 'Node & Edge',
    path: '/node-edge#chord',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/dXVisxZXpb/9c0a409c-9884-4b7b-8b63-f4f2c7781e48.png',
  },
]);
```

### Polygon

```js | dom "pin: false"
genji.preview([
  {
    title: 'Polygon',
    path: '/polygon#voronoi-plot',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/8y7qaQR%26zO/82c4470b-8427-4411-80bf-1a9ffc3928be.png',
  },
]);
```

### Image

```js | dom "pin: false"
genji.preview([
  {
    title: 'Image',
    path: '/image#basic-image',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/wUcPPv4pbU/24ca8e42-c323-48a4-bf19-4304ca262c7a.png',
  },
  {
    title: 'Image',
    path: '/image#image-combine-with-link',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/D993ZydZpK/4fd21de6-f471-4340-bf03-9ba3924da014.png',
  },
]);
```

### Text

```js | dom "pin: false"
genji.preview([
  {
    title: 'Basic WordCloud',
    path: '/text#basic-wordcloud',
    thumbnail:
      'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*Q3x-RJd_HR0AAAAAAAAAAAAAARQnAQ',
  },
  {
    title: 'Image WordCloud',
    path: '/text#image-wordcloud',
    thumbnail:
      'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*6EbeRocFE8EAAAAAAAAAAAAAARQnAQ',
  },
]);
```

### Schema

```js | dom "pin: false"
genji.preview([
  {
    title: 'Schema',
    path: '/schema#box-plot',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/hLflHDiP4p/9a4aa9ab-6dc6-4020-badd-9d40c46f3a52.png',
  },
]);
```

## Annotation

```js | dom "pin: false"
genji.preview(
  [
    {
      title: 'Text Annotation',
      path: '/annotation#text-annotation',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*rbg3QYa_Vx4AAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Badge Annotation',
      path: '/annotation#badge-annotation',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*VZLqQYo5pokAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'Connector Annotation',
      path: '/annotation#connector-annotation',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*pkbESpuunUwAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'RangeX Annotation',
      path: '/annotation#rangex-annotation',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*Pp1EQZdAIQMAAAAAAAAAAAAAARQnAQ',
    },
    {
      title: 'RangeY Annotation',
      path: '/annotation#rangey-annotation',
      thumbnail:
        'https://gw.alipayobjects.com/mdn/rms_dfc253/afts/img/A*nOmVR4gsaugAAAAAAAAAAAAAARQnAQ',
    },
  ],
  { height: 175 },
);
```

## Animation

> TODO

## Interaction

### Element

> TODO

### Component

> TODO

### Brush

```js | dom "pin: false"
genji.preview([
  {
    title: 'Schema',
    path: '/schema#box-plot',
    thumbnail:
      'https://gw.alipayobjects.com/zos/antfincdn/hLflHDiP4p/9a4aa9ab-6dc6-4020-badd-9d40c46f3a52.png',
  },
]);
```

## Composition

> TODO
