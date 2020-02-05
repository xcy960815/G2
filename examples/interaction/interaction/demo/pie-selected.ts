// FIXME：Label && Tooltip 交互
import { Chart } from '@antv/g2';

const data = [
  { item: '事例一', count: 40, percent: 0.4 },
  { item: '事例二', count: 21, percent: 0.21 },
  { item: '事例三', count: 17, percent: 0.17 },
  { item: '事例四', count: 13, percent: 0.13 },
  { item: '事例五', count: 9, percent: 0.09 },
];

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.data(data);
chart.scale('percent', {
  formatter: (val) => {
    val = val * 100 + '%';
    return val;
  },
});
chart.coordinate('theta');
chart.tooltip({
  showTitle: false,
  showMarkers: false,
});
chart.axis(false); // 关闭坐标轴
chart
  .interval()
  .adjust('stack')
  .position('percent')
  .color('item')
  .label('percent', {
    offset: -40,
    style: {
      textAlign: 'center',
      shadowBlur: 2,
      shadowColor: 'rgba(0, 0, 0, .45)',
      fill: '#fff',
    },
  })
  .tooltip('item*percent', (item, percent) => {
    percent = percent * 100 + '%';
    return {
      name: item,
      value: percent,
    };
  })
  .style({
    lineWidth: 1,
    stroke: '#fff',
  });

chart.render();
