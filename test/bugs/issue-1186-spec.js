const G2 = require('../../src/index');
const expect = require('chai').expect;

describe('#1186', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  it('axis event', () => {
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 }
    ];

    // Step 1: 创建 Chart 对象
    const chart = new G2.Chart({
      container: div, // 指定图表容器 ID
      height: 300, // 指定图表高度
      forceFit: true
    });

    // Step 2: 载入数据源
    chart.source(data, {
      genre: {
        alias: '游戏种类' // 列定义，定义该属性显示的别名
      },
      sold: {
        alias: '销售量'
      }
    });

    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    chart.interval()
      .position('genre*sold')
      .color('genre')
      .label('sold');

    // Step 4: 渲染图表
    chart.render();

    const axisController = chart.get('axisController');
    const xAxis = axisController.axes[0];
    const labelGroup = xAxis.get('group').get('children')[0];
    expect(labelGroup.get('children')[0].name).eql('axis-label');
  });
});
