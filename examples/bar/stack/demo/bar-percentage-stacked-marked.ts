import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';

const measureKeys = ['Europe', 'Asia', 'Africa'];
const originalData = [
  { year: '1750', Europe: 20, Asia: 30, Africa: 50 },
  { year: '1800', Europe: 30, Asia: 40, Africa: 30 },
  { year: '1850', Europe: 50, Asia: 20, Africa: 30 },
];
const colorSet = {
  Europe: '#4FAAEB',
  Asia: '#9AD681',
  Africa: '#FED46B',
};

// 计算每个柱子的占比
const ds = new DataSet();
const dv = ds
  .createView()
  .source(originalData)
  .transform({
    type: 'fold',
    fields: measureKeys,
    key: 'key',
    value: 'value',
  })
  .transform({
    type: 'percent',
    field: 'value',
    dimension: 'key',
    groupBy: ['year'],
    as: 'percent',
  });

// 初始化图表实例
const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 400,
});

chart.data(dv.rows);
chart.scale('percent', {
  min: 0,
  formatter(val) {
    return (val * 100).toFixed(2) + '%';
  },
});

// 是否水平翻转
// 改这个参数看效果！
const transposeCoord = true;

if (transposeCoord) {
  chart.coordinate('rect').transpose();
}

chart.tooltip({
  shared: true,
  showTooltipMarkers: false,
});

chart
  .interval()
  .adjust('stack')
  .position('year*percent')
  .color('key', (value) => colorSet[value]);

const totalValues = originalData.map((data) => measureKeys.map((key) => data[key]).reduce((a, b) => a + b, 0));
originalData.slice(1).forEach((data, dataIndex) => {
  measureKeys.forEach((key, keyIndex) => {
    const sliceArgs = transposeCoord ? [0, keyIndex + 1] : [keyIndex, measureKeys.length];
    // tslint:disable-next-line: no-shadowed-variable
    const getY = (dataIndex) => {
      // tslint:disable-next-line: no-shadowed-variable
      return (
        measureKeys
          .slice(...sliceArgs)
          // tslint:disable-next-line: no-shadowed-variable
          .map((key) => originalData[dataIndex][key])
          .reduce((a, b) => a + b, 0) / totalValues[dataIndex]
      );
    };
    const startPoint = {
      x: dataIndex + 0.25,
      y: getY(dataIndex),
    };
    const endPoint = {
      x: dataIndex + 0.75,
      y: getY(dataIndex + 1),
    };
    const percent = (originalData[dataIndex + 1][key] - originalData[dataIndex][key]) / totalValues[dataIndex];
    const symbol = percent === 0 ? '' : percent > 0 ? '+' : '-';
    const color = percent === 0 ? '#000' : percent > 0 ? 'red' : 'green';
    chart.annotation().line({
      start: [startPoint.x, startPoint.y],
      end: [endPoint.x, endPoint.y],
      style: {
        stroke: colorSet[key],
      },
      text: {
        position: 'center',
        autoRotate: false,
        offsetY: 0,
        style: {
          fill: color,
          textAlign: 'center',
          textBaseline: 'middle',
        },
        content: `${symbol}${(Math.abs(percent) * 100).toFixed(2)}%`,
      },
    });
  });
});
chart.render();
