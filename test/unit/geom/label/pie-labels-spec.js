const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const DataSet = require('@antv/data-set');
const PieLabels = require('../../../../src/geom/label/pie-labels');
const Coord = require('../../../../src/coord/');
const G2 = require('../../../../src/index');
const Scale = require('../../../../src/scale/index');

describe('pie labels', function() {
  const ds = new DataSet();

  const div = document.createElement('div');
  div.id = 'gl3';
  document.body.appendChild(div);

  const canvas = new Canvas({
    containerId: 'gl3',
    width: 500,
    height: 500
  });

  describe('pie text inner', function() {
    const coord = new Coord.Polar({
      start: {
        x: 0,
        y: 100
      },
      end: {
        x: 100,
        y: 0
      }
    });

    coord.transpose();
    const points = [];
    const values = [];
    for (let i = 0; i < 8; i++) {
      const obj = coord.convertPoint({
        x: 0.5,
        y: i / 8
      });
      const endPoint = coord.convertPoint({
        x: 0.5,
        y: (i + 1) / 8
      });
      const point = {
        x: [ obj.x, endPoint.x ],
        y: [ obj.y, endPoint.y ],
        label: i.toString(),
        _origin: {
          x: [ obj.x, endPoint.x ],
          y: [ obj.y, endPoint.y ],
          label: i.toString()
        }
      };
      values.push(i.toString());
      points.push(point);
    }

    const scale = Scale.cat({
      field: 'label',
      values
    });
    let gLabels;

    it('init', function() {
      gLabels = canvas.addGroup(PieLabels, {
        coord,
        labelCfg: {
          cfg: {
            offset: -10
          },
          scales: [ scale ]
        },
        geomType: 'point'
      });

      const cfg = gLabels.get('label');
      expect(cfg.offset).to.equal(-10);
      expect(cfg.textStyle).not.to.equal(undefined);
    });

    let items;

    it('get items', function() {
      items = gLabels.getLabelsItems(points);
      expect(items.length).to.equal(points.length);
    });

    it('first point rotate', function() {
      const first = items[0];

      expect(first.x).to.equal(65.3073372946036);
      expect(first.y).to.equal(13.044818699548529);
      expect(first.rotate).to.equal(-67.5 / 180 * Math.PI);
      expect(first.textAlign).to.equal('right');
    });

    it('second point', function() {
      const second = items[1];
      expect(second.x).to.equal(86.95518130045147);
      expect(second.y).to.equal(34.69266270539641);
      expect(second.rotate).to.equal(-22.5 / 180 * Math.PI);
    });

    it('third point', function() {
      const point = items[2];


      expect(point.x).to.equal(86.95518130045147);
      expect(point.y).to.equal(65.3073372946036);
      expect(point.rotate).to.equal(22.5 / 180 * Math.PI);
    });

    it('show labels', function() {
      gLabels.showLabels(points);
      canvas.draw();
      expect(gLabels.get('labelsGroup').get('children').length).to.equal(points.length);
    });
  });

  describe('pie text outter', function() {
    const coord = new Coord.Polar({
      start: {
        x: 200,
        y: 200
      },
      end: {
        x: 300,
        y: 0
      }
    });

    coord.transpose();
    const points = [];
    const values = [];
    for (let i = 0; i < 6; i++) {
      const obj = coord.convertPoint({
        x: 0.5,
        y: i / 6
      });
      const endPoint = coord.convertPoint({
        x: 0.5,
        y: (i + 1) / 6
      });
      const point = {
        x: [ obj.x, endPoint.x ],
        y: [ obj.y, endPoint.y ],
        color: 'red',
        label: i.toString(),
        _origin: {
          x: [ obj.x, endPoint.x ],
          y: [ obj.y, endPoint.y ],
          color: 'red',
          label: i.toString()
        }
      };

      values.push(i.toString());
      points.push(point);
    }
    const scale = Scale.cat({
      field: 'label',
      values
    });
    let gLabels;
    it('init', function() {
      gLabels = canvas.addGroup(PieLabels, {
        coord,
        labelCfg: {
          cfg: {
            offset: 10
          },
          scales: [ scale ]
        },
        geomType: 'point'
      });

      const cfg = gLabels.get('label');
      expect(cfg.offset).to.equal(10);
      expect(cfg.textStyle).not.to.equal(undefined);
      expect(cfg.labelLine).not.to.equal(undefined);
      // expect(cfg.label.fill).to.equal('#fff');
    });
    let items;
    it('get items', function() {
      items = gLabels.getLabelsItems(points);
      expect(items.length).to.equal(points.length);

    });

    it('points', function() {
      expect(items[0].x).to.equal(280);
      expect(items[0].y).to.equal(48.03847577293368);

      expect(items[1].x).to.equal(310);
      expect(items[1].y).to.equal(100);

      expect(items[2].x).to.equal(280);
      expect(items[2].y).to.equal(151.96152422706632);

      expect(items[5].x).to.equal(220);
      expect(+(items[5].y).toFixed(14)).to.equal(48.03847577293369);
    });

    it('show labels', function() {
      gLabels.showLabels(points);
      canvas.draw();
      expect(gLabels.get('labelsGroup').get('children').length).to.equal(points.length);
      expect(gLabels.get('lineGroup').get('children').length).to.equal(points.length);
    });

  });

  describe('pie text not stack', function() {
    const coord = new Coord.Polar({
      start: {
        x: 100,
        y: 300
      },
      end: {
        x: 200,
        y: 200
      }
    });

    coord.transpose();
    const points = [];
    const values = [];
    for (let i = 1; i <= 4; i++) {
      const obj = coord.convertPoint({
        x: 0.5,
        y: i / 4
      });

      const point = {
        x: obj.x,
        y: obj.y,
        color: 'green',
        label: i.toString(),
        _origin: {
          x: obj.x,
          y: obj.y,
          color: 'green',
          label: i.toString()
        }
      };
      values.push(i.toString());
      points.push(point);
    }
    const scale = Scale.cat({
      field: 'label',
      values
    });
    let gLabels;
    it('init', function() {
      gLabels = canvas.addGroup(PieLabels, {
        coord,
        labelCfg: {
          cfg: {
            offset: 20,
            labelHeight: 10
          },
          scales: [ scale ]
        },
        geomType: 'point'
      });

      const cfg = gLabels.get('label');
      expect(cfg.offset).to.equal(20);
      expect(cfg.textStyle).not.to.equal(undefined);
      expect(cfg.labelLine).not.to.equal(undefined);
    });
    let items;
    it('get items', function() {
      items = gLabels.getLabelsItems(points);
      expect(items.length).to.equal(points.length);
    });

  });


  describe('pie text more', function() {
    const coord = new Coord.Polar({
      start: {
        x: 100,
        y: 300
      },
      end: {
        x: 200,
        y: 200
      }
    });

    coord.transpose();
    const points = [];
    const values = [];
    for (let i = 0; i < 24; i++) {
      const obj = coord.convertPoint({
        x: 0.5,
        y: i / 24
      });
      const endPoint = coord.convertPoint({
        x: 0.5,
        y: (i + 1) / 24
      });
      const point = {
        x: [ obj.x, endPoint.x ],
        y: [ obj.y, endPoint.y ],
        color: 'green',
        label: i.toString(),
        _origin: {
          x: [ obj.x, endPoint.x ],
          y: [ obj.y, endPoint.y ],
          color: 'green',
          label: i.toString()
        }
      };
      values.push(i.toString());
      points.push(point);
    }
    const scale = Scale.cat({
      field: 'label',
      values
    });

    let gLabels;
    it('init', function() {
      gLabels = canvas.addGroup(PieLabels, {
        coord,
        labelCfg: {
          cfg: {
            offset: 20,
            labelHeight: 10
          },
          scales: [ scale ]
        },
        geomType: 'point'
      });

      const cfg = gLabels.get('label');
      expect(cfg.offset).to.equal(20);
      expect(cfg.textStyle).not.to.equal(undefined);
      expect(cfg.labelLine).not.to.equal(undefined);
    });
    let items;
    it('get items', function() {
      items = gLabels.getLabelsItems(points);
      expect(items.length).to.equal(points.length);
    });
    it('show labels', function() {
      gLabels.showLabels(points);
      canvas.draw();
    });

  });

  describe('pie,polar text position', function() {
    const chart = new G2.Chart({
      container: 'gl3',
      width: 400,
      height: 300,
      animate: false,
      padding: [ 20, 10, 50, 60 ]
    });
    const defs = {
      visiter: { min: 0 }
    };
    let data;

    beforeEach(() => {
      data = [
        { action: '访问', visiter: 500, text: 'xxdadsfsadfasdfadsf' },
        { action: '浏览', visiter: 400, text: 'sfsadfasdfadsf' },
        { action: '交互', visiter: 300, text: 'xxdadsfs' },
        { action: '下单', visiter: 200, text: 'fsadfasdfadsf' },
        { action: '付款', visiter: 100, text: 'xxd' }
      ];
    });

    it('radar outer', function() {
      chart.clear();
      chart.coord('polar');
      chart.source(data);
      chart.scale(defs);
      chart.interval()
        .position('action*visiter')
        .color('action')
        .label('visiter', { offset: 10 });
      chart.render();

      const geom = chart.get('geoms')[0];
      const labelsGroup = geom.get('labelContainer').get('labelsGroup');

      const first = labelsGroup.getFirst();
      const last = labelsGroup.getLast();

      expect(first.attr('x')).to.equal(450 / 2);
      expect(first.attr('y')).to.equal(20 / 2);

      expect(last.attr('x')).to.equal(387.23026992451986 / 2);
      expect(last.attr('y')).to.equal(249.60487837125345 / 2);
    });

    it('radar inner', function() {
      chart.clear();

      chart.coord('polar');
      chart.source(data, defs);
      chart.interval()
        .position('action*visiter')
        .color('action')
        .label('visiter', { offset: -10 });
      chart.render();

      const geom = chart.get('geoms')[0];
      const labelsGroup = geom.get('labelContainer').get('labelsGroup');

      const first = labelsGroup.getFirst();
      const last = labelsGroup.getLast();

      expect(first.attr('x')).to.equal(450 / 2);
      expect(first.attr('y')).to.equal(60 / 2);
      expect(last.attr('x')).to.equal(425.272530576326 / 2);
      expect(last.attr('y')).to.equal(261.96555814625134 / 2);
    });

    it('pie outer text', function() {
      const dv = ds.createView('pie-outer-text').source(data);
      dv.transform({
        type: 'percent',
        field: 'visiter',
        dimension: 'action',
        as: 'percent'
      });
      chart.clear();
      chart.coord('theta');
      chart.source(dv.rows);
      chart.interval()
        .position('percent')
        .adjust('stack')
        .color('action')
        .label('visiter', { offset: 15 });
      chart.render();

      const geom = chart.get('geoms')[0];
      const labelsGroup = geom.get('labelContainer').get('labelsGroup');

      const first = labelsGroup.getFirst();
      const last = labelsGroup.getLast();

      expect(first.attr('x')).to.equal(197.97148019369132);
      expect(first.attr('y')).to.equal(7.8408119046052605);
      expect(last.attr('x')).to.equal(274.6162223093975);
      expect(last.attr('y')).to.equal(255.1591880953947);
    });

    it('pie inner text', function() {
      const dv = ds.createView('pie-inner-text').source(data);
      dv.transform({
        type: 'percent',
        field: 'visiter',
        dimension: 'action',
        as: 'percent'
      });
      chart.clear();
      chart.coord('theta');
      chart.source(dv.rows);
      chart.interval()
        .position('percent')
        .adjust('stack')
        .color('action')
        .label('visiter', { offset: -5 });
      chart.render();

      const geom = chart.get('geoms')[0];
      const labelsGroup = geom.get('labelContainer').get('labelsGroup');

      const first = labelsGroup.getFirst();
      const last = labelsGroup.getLast();

      expect(first.attr('x')).to.equal(640.5255888325765 / 2);
      expect(first.attr('y')).to.equal(160.00000000000006 / 2);

      expect(last.attr('x')).to.equal(404.25942802009297 / 2);
      expect(last.attr('y')).to.equal(54.80752783856275 / 2);
    });
  });

  describe('unusual pie labeling', function() {
    const chart = new G2.Chart({
      container: 'gl3',
      width: 600,
      height: 500,
      animate: false
      // plotCfg: {
      //   margin: [80, 120]
      // }
    });
    let data;

    beforeEach(() => {
      data = [
        { type: '1E', value: 0 },
        { type: '1F', value: 0 },
        { type: '1g', value: 0 },
        { type: '1H', value: 0 },
        { type: '1I', value: 0 },
        { type: '1J', value: 0 },
        { type: 'A', value: 2 },
        { type: 'B', value: 2 },
        { type: '2E', value: 0 },
        { type: '2F', value: 0 },
        { type: '2g', value: 0 },
        { type: '2H', value: 0 },
        { type: '2I', value: 0 },
        { type: '2J', value: 0 },
        { type: 'C', value: 2 },
        { type: 'D', value: 2 },
        { type: 'E', value: 0 },
        { type: 'F', value: 0 },
        { type: 'g', value: 0 },
        { type: 'H', value: 0 },
        { type: 'I', value: 0 },
        { type: 'J', value: 0 },
        { type: 'K', value: 4 },
        { type: '3E', value: 0 },
        { type: '3F', value: 0 },
        { type: '3g', value: 0 },
        { type: '3H', value: 0 },
        { type: '3I', value: 0 },
        { type: '3J', value: 0 },
        { type: 'L', value: 4 }
      ];
    });

    it('pie labeling overlap', function() {
      const dv = ds.createView().source(data);
      dv.transform({
        type: 'percent',
        field: 'value',
        dimension: 'type',
        as: 'percent'
      });

      chart.clear();
      chart.coord('theta', {
        radius: 0.8
      });
      chart.legend(false);
      chart.source(dv.rows);
      chart.interval()
        .position('percent')
        .adjust('stack')
        .color('type')
        .label('type*percent', function(type, percent) {
          return type + ': ' + percent * 100 + '%';
        });
      chart.render();
      const geom = chart.get('geoms')[0];
      const labelsGroup = geom.get('labelContainer').get('labelsGroup');

      const first = labelsGroup.getFirst();
      const last = labelsGroup.getLast();

      expect(first.attr('x')).to.be.equal(199.89235226167526);
      expect(first.attr('y')).to.be.equal(82.39235226167526);
      expect(last.attr('x')).to.be.equal(330);
      expect(last.attr('y')).to.be.equal(398);
    });
  });

  describe('pie text more', function() {
    const coord = new Coord.Polar({
      start: {
        x: 300,
        y: 300
      },
      end: {
        x: 400,
        y: 200
      }
    });
    coord.transpose();
    const points = [];
    const values = [];
    for (let i = 0; i < 48; i++) {
      const obj = coord.convertPoint({
        x: 0.5,
        y: i / 48
      });
      const endPoint = coord.convertPoint({
        x: 0.5,
        y: (i + 1) / 48
      });
      const point = {
        x: [ obj.x, endPoint.x ],
        y: [ obj.y, endPoint.y ],
        color: 'green',
        label: i.toString(),
        _origin: {
          x: [ obj.x, endPoint.x ],
          y: [ obj.y, endPoint.y ],
          color: 'green',
          label: i.toString()
        }
      };
      values.push(i.toString());
      points.push(point);
    }
    const scale = Scale.cat({
      field: 'label',
      values
    });
    let gLabels;
    it('init', function() {
      gLabels = canvas.addGroup(PieLabels, {
        coord,
        labelCfg: {
          cfg: {
            offset: 30,
            labelHeight: 10
          },
          scales: [ scale ]
        },
        geomType: 'point'
      });

      const cfg = gLabels.get('label');
      expect(cfg.offset).to.equal(30);
      expect(cfg.textStyle).not.to.equal(undefined);
      expect(cfg.labelLine).not.to.equal(undefined);
    });
    it('get items', function() {
      gLabels.getLabelsItems(points);
      expect(gLabels.get('labelsGroup').get('children').length).not.to.equal(points.length);
    });
    it('show labels', function() {
      gLabels.showLabels(points);
      canvas.draw();
    });

    xit('remove', function() {
      // $('#gl3').remove();
    });
  });

  describe('Just one label.', function() {
    it('Even though source data just has one item, the label must be shown.', function() {
      const dv = ds.createView().source([
        { name: 'Singapore', count: 28 }
      ]);
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'name',
        as: 'percent'
      });

      const chart = new G2.Chart({
        container: 'gl3',
        width: 400,
        height: 300,
        animate: false
      });
      chart.source(dv.rows);
      chart.coord('theta');
      chart.interval()
        .position('percent')
        .adjust('stack')
        .color('name')
        .label('name*percent', function(name, percent) {
          percent = (percent * 100).toFixed(2) + '%';
          return name + ' ' + percent;
        });
      chart.render();

      const geom = chart.get('geoms')[0];
      const labelGroup = geom.get('labelContainer');
      const labelsGroup = labelGroup.get('labelsGroup');
      const cText = labelsGroup.get('children')[0];
      console.log(cText.get('attrs').x, cText.get('attrs').y);
      expect(cText.get('attrs').x).to.equal(270.8166632639171);
      expect(cText.get('attrs').y).to.equal(228);
    });
  });
});
