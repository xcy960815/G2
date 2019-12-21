// TODO: 绘制出错
import { Chart } from '@antv/g2';

fetch('../data/mobile.json')
  .then((res) => res.json())
  .then((mobiles) => {
    const { DataView } = DataSet;
    // 会通过子节点累加 value 值，所以设置为 0
    mobiles.forEach(function(mobile) {
      mobile.value = null;
    });
    const data = {
      name: 'root',
      children: mobiles,
    };
    const dv = new DataView();
    dv.source(data, {
      type: 'hierarchy',
    }).transform({
      field: 'value',
      type: 'hierarchy.treemap',
      tile: 'treemapResquarify',
      as: ['x', 'y'],
    });
    const nodes = dv.getAllNodes();
    nodes.map(function(node) {
      node.name = node.data.name;
      if (!node.data.brand && node.parent) {
        node.brand = node.parent.data.brand;
      } else {
        node.brand = node.data.brand;
      }
      // node.value = node.data.value;
      return node;
    });
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
      padding: 0,
    });
    chart.coordinate().scale(1, -1); // 习惯性最小的在最下面
    chart.data(nodes);
    chart.scale({
      x: {
        nice: false,
      },
      y: {
        nice: false,
      },
    });
    chart.axis(false);
    chart.legend(false);
    chart.tooltip(false);
    chart.animate(false);
    chart
      .polygon()
      .position('x*y')
      .color('brand')
      .style({
        lineWidth: 0.5,
        stroke: 'rgba(255,255,255,0.65)',
      })
      .label(
        'brand*depth*name',
        (brand, depth, name) => {
          if (depth !== 1 || name === '其他') {
            // 只有第一级显示文本，数值太小时不显示文本
            return {
              content: name,
              style: {
                shadowColor: 'rgba(0,0,0,0.5)',
                shadowBlur: 3,
              },
              offset: 0,
            };
          }
          return null;
        },
        {
          adjustType: 'treemap',
        }
      );
    chart.render();
  });
