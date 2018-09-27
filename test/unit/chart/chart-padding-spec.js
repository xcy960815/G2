const expect = require('chai').expect;
const Chart = require('../../../src/chart/chart');

const div = document.createElement('div');
document.body.appendChild(div);

describe('chart auto padding', function() {
  describe('all auto', function() {

    const data = [
      { genre: 'Sports', sold: 475, type: '1' },
      { genre: 'Strategy', sold: 115, type: '1' },
      { genre: 'Action', sold: 120, type: '1' },
      { genre: 'Shooter', sold: 350, type: '1' },
      { genre: 'Other', sold: 150, type: '1' }
    ];
    const chart = new Chart({
      container: div,
      height: 300,
      width: 500,
      animate: false,
      padding: 'auto',
      autoPaddingAppend: 0
    });
    chart.get('canvas').get('el').style.border = '1px solid red';
    chart.legend({
      position: 'right'
    });
    chart.source(data);
    it('init', function() {

      chart.interval().position('genre*sold').color('genre');
      chart.render();
      const plotRange = chart.get('plotRange');
      // expect(plotRange.tl).eqls({ x: 35.33984375, y: 6.5 });
      expect(plotRange.tl.x > 30).equal(true);
      expect(plotRange.tl.y > 6).equal(true);
    });

    it('change coord', function(done) {
      setTimeout(function() {
        chart.clear();
        chart.coord().scale(1, -1);
        chart.interval().position('genre*sold').color('genre');
        chart.render();
        const plotRange = chart.get('plotRange');
        // expect(plotRange.tl.x > 35).eqls({ x: 35.33984375, y: 28.5 });
        expect(plotRange.tl.x > 30).equal(true);
        expect(plotRange.tl.y > 28).equal(true);
        done();
      }, 100);
    });
    let prePoint;
    it('change data', function(done) {
      setTimeout(function() {
        const data = [
          { genre: 'Sports', sold: 475, type: '1' },
          { genre: 'Strategy', sold: 115, type: '1' },
          { genre: 'Action', sold: 120, type: '1' },
          { genre: 'Shooter', sold: 350, type: '1' },
          { genre: 'Other', sold: 150, type: '1' },
          { genre: 'newwwwwwwwwww', sold: 1500, type: '1' }
        ];
        chart.changeData(data);
        const plotRange = chart.get('plotRange');
        // expect(plotRange.tl).eqls({ x: 40.935546875, y: 45.8522451815097 });
        expect(plotRange.tl.x > 38).equal(true);
        expect(plotRange.tl.y > 45).equal(true);
        prePoint = plotRange.tl;
        done();
      }, 100);
    });

    it('change size', function(done) {
      setTimeout(function() {
        chart.changeSize(800, 500);
        const plotRange = chart.get('plotRange');
        expect(plotRange.tl).eqls(prePoint);
        done();
      }, 100);
    });

    it('destroy', function() {
      chart.destroy();
      expect(chart.destroyed).equal(true);
    });
  });

  describe('not all auto', function() {
    const data = [
      { genre: 'Sports', sold: 475, type: '1' },
      { genre: 'Strategy', sold: 115, type: '1' },
      { genre: 'Action', sold: 120, type: '1' },
      { genre: 'Shooter', sold: 350, type: '1' },
      { genre: 'Other', sold: 150, type: '1' }
    ];
    const chart = new Chart({
      container: div,
      height: 300,
      width: 500,
      animate: true,
      padding: [ 10, 20, 'auto', 'auto' ],
      autoPaddingAppend: 10
    });

    chart.source(data);

    it('init', function() {
      chart.interval().position('genre*sold').color('genre');
      chart.render();
      const plotRange = chart.get('plotRange');
      // expect(plotRange.tl).eqls({ x: 45.33984375, y: 10 });
      // expect(plotRange.bl).eqls({ x: 45.33984375, y: 224.5 });
      expect(plotRange.tl.x > 42).equal(true);
      expect(plotRange.tl.y).equal(10);
      expect(plotRange.bl.x > 42).equal(true);
      expect(plotRange.bl.y >= 224).equal(true);
    });
    let pretl;
    let prebl;
    it('change data', function(done) {
      setTimeout(function() {
        const data = [
          { genre: 'Sports', sold: 475, type: '1' },
          { genre: 'Strategy', sold: 115, type: '1' },
          { genre: 'Action', sold: 120, type: '1' },
          { genre: 'Shooter', sold: 350, type: '1' },
          { genre: 'Other', sold: 150, type: '1' },
          { genre: 'newwwwwwwwwww', sold: 1500, type: '1' }
        ];
        chart.changeData(data);
        const plotRange = chart.get('plotRange');
        // expect(plotRange.tl).eqls({ x: 50.935546875, y: 10 });
        // expect(plotRange.bl).eqls({ x: 50.935546875, y: 202.5 });
        expect(plotRange.tl.x > 49).equal(true);
        expect(plotRange.tl.y).equal(10);
        expect(plotRange.bl.x > 49).equal(true);
        expect(plotRange.bl.y > 190).equal(true);
        pretl = plotRange.tl;
        prebl = plotRange.bl;
        done();
      }, 100);
    });

    it('change size', function(done) {
      setTimeout(function() {
        chart.changeSize(600, 300);
        const plotRange = chart.get('plotRange');
        expect(plotRange.tl).eqls(pretl);
        expect(plotRange.bl).eqls(prebl);
        done();
      }, 100);
    });

    it('force fit', function(done) {
      setTimeout(function() {
        chart.forceFit();
        const plotRange = chart.get('plotRange');
        expect(plotRange.tl).eqls(pretl);
        expect(plotRange.bl).eqls(prebl);
        done();
      }, 800);
    });

    it('change to no auto', function(done) {
      setTimeout(function() {
        chart.set('padding', 40);
        chart.repaint();
        const plotRange = chart.get('plotRange');
        expect(plotRange.tl).eqls({ x: 40, y: 40 });
        expect(plotRange.bl).eqls({ x: 40, y: 260 });
        done();
      }, 800);
    });

    it('destroy', function() {
      chart.destroy();
      expect(chart.destroyed).equal(true);
    });
  });
});
