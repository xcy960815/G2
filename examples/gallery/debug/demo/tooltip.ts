import { Chart } from '@antv/g2';

const data = [
  { name: 'London', 月份: 'Jan.', 月均降雨量: 18.9 },
  { name: 'London', 月份: 'Feb.', 月均降雨量: 8.8 },
  { name: 'London', 月份: 'Mar.', 月均降雨量: 39.3 },
  { name: 'London', 月份: 'May', 月均降雨量: 47 },
  { name: 'London', 月份: 'Jun.', 月均降雨量: 20.3 },
  { name: 'London', 月份: 'Jul.', 月均降雨量: 24 },
  { name: 'London', 月份: 'Aug.', 月均降雨量: 35.6 },
  { name: 'Berlin', 月份: 'Jan.', 月均降雨量: 12.4 },
  { name: 'Berlin', 月份: 'Feb.', 月均降雨量: 23.2 },
  { name: 'Berlin', 月份: 'Mar.', 月均降雨量: 34.5 },
  { name: 'Berlin', 月份: 'Apr.', 月均降雨量: 99.7 },
  { name: 'Berlin', 月份: 'May', 月均降雨量: 52.6 },
  { name: 'Berlin', 月份: 'Jun.', 月均降雨量: 35.5 },
  { name: 'Berlin', 月份: 'Jul.', 月均降雨量: 37.4 },
  { name: 'Berlin', 月份: 'Aug.', 月均降雨量: 42.4 },
];
const chart = new Chart({
  container: 'container',
  autoFit: false,
  height: 500,
  width: 500,
});
chart.data(data);
chart.scale('月均降雨量', {
  max: 150,
});
chart.tooltip({
  showTooltipMarkers: true,
  shared: true,
  showCrosshairs: true,
});
chart.interaction('activeRegion');
chart
  // @ts-ignore
  .interval()
  .position('月份*月均降雨量')
  .color('name')
  .adjust('stack')
  .style({
    lineWidth: 1,
    stroke: '#fff',
  });

chart.render();
