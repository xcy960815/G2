const expect = require('chai').expect;
const { Canvas } = require('../../../src/renderer2d');
const View = require('../../../src/chart/view');
const Chart = require('../../../src/chart/chart');
const Coord = require('../../../src/coord/index');

const div = document.createElement('div');
div.id = 'cview';
document.body.appendChild(div);

const canvas = new Canvas({
  containerId: 'cview',
  width: 500,
  height: 500
});

const coord = new Coord.Rect({
  start: {
    x: 80,
    y: 420
  },
  end: {
    x: 420,
    y: 80
  }
});

describe('test view', function() {
  const backPlot = canvas.addGroup();
  const group = canvas.addGroup();
  const view = new View({
    middlePlot: group,
    canvas,
    coord,
    backPlot,
    options: {
      scales: {
        e: {
          type: 'cat',
          values: [ 'a', 'b', 'c' ]
        }
      },
      axes: {
        a: {
          title: null
        },
        b: {
          label: {
            autoRotate: false
          },
          grid: {
            align: 'center'
          },
          title: {
            offset: -1,
            position: 'end',
            autoRotate: false,
            textStyle: {
              fontSize: 16,
              fill: 'red',
              textBaseline: 'bottom'
            }
          }
        }
      },
      animate: false
    }
  });

  it('init', function() {
    expect(view.get('scaleController')).not.equal(null);
    expect(view.get('axisController')).not.equal(null);
    expect(view.get('guideController')).not.equal(null);
  });

  it('options', function() {
    expect(view.get('options').scales).not.equal(undefined);
    expect(view.get('options').axes).not.equal(undefined);
  });

  it('geom method', function() {
    expect(view.line).to.be.a('function');
    expect(view.point).to.be.a('function');
  });

  it('scale', function() {
    view.scale('a', {
      type: 'linear',
      min: 0
    });
    expect(view.get('options').scales.a.min).equal(0);
  });

  it('axis', function() {
    view.axis(false);
    expect(view.get('options').axes).to.be.false;
    view.axis(true);
    expect(view.get('options').axes).not.to.be.false;

    view.axis('a', {
      title: {
        textStyle: {
          fill: 'red'
        }
      }
    });
    expect(view.get('options').axes.a.title).not.to.be.null;
  });

  it('guide', function() {
    view.guide().line({
      start: {
        a: 1,
        b: 2
      },
      end: {
        a: 3,
        b: 4
      },
      text: {
        content: '辅助线的辅助文本',
        position: 0.3
      }
    });
    const guideController = view.get('guideController');
    expect(guideController.options).not.to.be.empty;
    expect(guideController.options.line).not.to.be.null;
  });

  it('source', function() {
    const data = [
      { a: 1, b: 2 },
      { a: 2, b: 5 },
      { a: 3, b: 4 }
    ];
    view.source(data);
    expect(view.get('data')).equal(data);
  });

  it('add geom', function() {
    const line = view.line().position('a*b');
    expect(view.get('geoms').length).equal(1);
    expect(view.get('geoms')[0]).equal(line);
  });

  it('render', function() {
    view.render();
    expect(group.getCount()).equal(1);
    const ascale = view.get('scales').a;
    expect(ascale.max).equal(3);
    const path = group.getFirst().getFirst();
    expect(path.get('type')).equal('path');
    expect(path.attr('path').length).eqls(3);
    canvas.draw();
  });

  it('change data', function() {
    const data = [
      { a: 1, b: 2 },
      { a: 2, b: 5 },
      { a: 3, b: 2 },
      { a: 4, b: 1 }
    ];

    view.changeData(data);
    const ascale = view.get('scales').a;
    expect(ascale.max).equal(4);
    expect(group.getCount()).equal(1);
    const path = group.getFirst().getFirst();
    expect(path.get('type')).equal('path');
    expect(path.attr('path').length).eqls(4);
    canvas.draw();
  });

  it('clear', function() {
    view.clear();
    expect(view.get('geoms').length).equal(0);
    expect(group.getCount()).equal(0);
  });

  it('destroy', function() {
    view.destroy();
    expect(view.destroyed).equal(true);
    group.remove();
    canvas.draw();
  });
});

describe('test view all options', function() {
  const backPlot = canvas.addGroup();
  const group = canvas.addGroup();

  const data = [
      { a: 1, b: 2, c: '1' },
      { a: 2, b: 5, c: '1' },
      { a: 3, b: 4, c: '1' },

      { a: 1, b: 3, c: '2' },
      { a: 2, b: 1, c: '2' },
      { a: 3, b: 2, c: '2' }
  ];
  const view = new View({
    viewContainer: group,
    canvas,
    backPlot,
    start: {
      x: 80,
      y: 420
    },
    end: {
      x: 420,
      y: 80
    },
    data,
    animate: false,
    options: {
      coord: {
        type: 'rect',
        actions: [
          [ 'transpose' ]
        ]
      },
      geoms: [
        { type: 'line', position: 'a*b', color: 'c' },
        { type: 'point', position: 'c*b', color: 'a' }
      ]
    }
  });
  it('init', function() {
    expect(view.get('coordController').actions.length).equal(1);
  });
  it('render', function() {
    view.render();
    expect(view.get('geoms').length).equal(2);
    const line = view.get('geoms')[0];
    expect(line.get('attrOptions').position.field).eqls('a*b');
    canvas.draw();
  });
  it('getXY', function() {
    let data = {
      a: 1.5,
      c: '1'
    };
    let coord = view.getXY(data);
    expect(coord).to.be.null;
    data = {
      a: 1.5,
      b: 2
    };
    coord = view.getXY(data);
    expect(coord).eql({ x: 165, y: 335 });

    data = {
      c: '1',
      b: 2
    };
    coord = view.getXY(data);
    expect(coord).eql({ x: 165, y: 420 });
  });
  it('clear', function() {
    view.clear();
    expect(view.get('geoms').length).equal(0);
  });
  it('change', function() {
    view.changeOptions({
      coord: {
        type: 'rect'
      },
      geoms: [
        { type: 'line', position: 'a*b', color: 'c' }
      ]
    });
    expect(view.get('geoms').length).equal(1);
    view.render();
    canvas.draw();
  });
});

describe('view get shape and records', function() {
  // canvas.destroy();
  const data = [
    { month: 0, tokyo: 7, newYork: -0.2, berlin: -0.9 },
    { month: 1, tokyo: 6.9, newYork: 0.8, berlin: 0.6 },
    { month: 7, tokyo: 26.5, newYork: 24.1, berlin: 17.9 },
    { month: 11, tokyo: 9.6, newYork: 2.5, berlin: 1 },
    { month: 2, tokyo: 9.5, newYork: 5.7, berlin: 3.5 },
    { month: 3, tokyo: 14.5, newYork: 11.3, berlin: 8.4 },
    { month: 8, tokyo: 23.3, newYork: 20.1, berlin: 14.3 },
    { month: 10, tokyo: 13.9, newYork: 8.6, berlin: 3.9 },
    { month: 9, tokyo: 18.3, newYork: 14.1, berlin: 9 },
    { month: 4, tokyo: 18.2, newYork: 17, berlin: 13.5 },
    { month: 5, tokyo: 21.5, newYork: 22, berlin: 17 },
    { month: 6, tokyo: 25.2, newYork: 24.8, berlin: 18.6 }
  ];
  const chart = new Chart({
    id: 'cview',
    width: 500,
    height: 500,
    animate: false
  });

  chart.source(data);
  chart.point().position('month*tokyo');
  chart.render();

  it('getSnapRecords point', function() {
    let point = {
      x: 173,
      y: 253
    };
    let records = chart.getSnapRecords(point);
    expect(records.length).equal(1);
    expect(records[0]._origin.month).equal(3);

    point = {
      x: 291,
      y: 59
    };

    records = chart.getSnapRecords(point);
    expect(records[0]._origin.month).equal(6);
  });

  it('getSnapRecords line，已排序', function() {
    chart.clear();
    chart.source([
      { month: 0, tem: 7, city: 'tokyo' },
      { month: 1, tem: 6.9, city: 'tokyo' },
      { month: 3, tem: 14.5, city: 'tokyo' },
      { month: 4, tem: 18.2, city: 'tokyo' },
      { month: 2, tem: 9.5, city: 'tokyo' },
      { month: 5, tem: 21.5, city: 'tokyo' },
      { month: 6, tem: 25.2, city: 'tokyo' },
      { month: 7, tem: 26.5, city: 'tokyo' },
      { month: 8, tem: 23.3, city: 'tokyo' },
      { month: 9, tem: 18.3, city: 'tokyo' },
      { month: 11, tem: 9.6, city: 'tokyo' },
      { month: 10, tem: 13.9, city: 'tokyo' },
      { month: 3, tem: 11.3, city: 'newYork' },
      { month: 4, tem: 17, city: 'newYork' },
      { month: 0, tem: -0.2, city: 'newYork' },
      { month: 1, tem: 0.8, city: 'newYork' },
      { month: 2, tem: 5.7, city: 'newYork' },
      { month: 5, tem: 22, city: 'newYork' },
      { month: 9, tem: 14.1, city: 'newYork' },
      { month: 10, tem: 8.6, city: 'newYork' },
      { month: 6, tem: 24.8, city: 'newYork' },
      { month: 7, tem: 24.1, city: 'newYork' },
      { month: 8, tem: 20.1, city: 'newYork' },
      { month: 11, tem: 2.5, city: 'newYork' },
      { month: 0, tem: -0.9, city: 'berlin' },
      { month: 2, tem: 3.5, city: 'berlin' },
      { month: 3, tem: 8.4, city: 'berlin' },
      { month: 4, tem: 13.5, city: 'berlin' },
      { month: 5, tem: 17, city: 'berlin' },
      { month: 8, tem: 14.3, city: 'berlin' },
      { month: 9, tem: 9, city: 'berlin' },
      { month: 10, tem: 3.9, city: 'berlin' },
      { month: 6, tem: 18.6, city: 'berlin' },
      { month: 7, tem: 17.9, city: 'berlin' },
      { month: 1, tem: 0.6, city: 'berlin' },
      { month: 11, tem: 1, city: 'berlin' }
    ]);
    chart.line().position('month*tem').color('city');
    chart.render();

    expect(chart.get('geoms')[0].get('sortable')).to.be.true;
    let point = {
      x: 333,
      y: 192
    };
    let records = chart.getSnapRecords(point);
    expect(records.length).equal(3);
    expect(records[0]._origin.month).equal(8);

    point = {
      x: 137,
      y: 440
    };

    records = chart.getSnapRecords(point);
    expect(records[0]._origin.month).equal(2);
    chart.destroy();
  });
});
