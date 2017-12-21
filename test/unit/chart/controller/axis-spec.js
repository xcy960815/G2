const expect = require('chai').expect;
const AxisController = require('../../../../src/chart/controller/axis');
const Coord = require('../../../../src/coord/index');


describe('AxisController', function() {
  const start = {
    x: 0,
    y: 500
  };
  const end = {
    x: 500,
    y: 0
  };
  const coord = new Coord.Rect({
    start,
    end
  });
  const scaleX = {
    field: 'a',
    getTicks() {
      return [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
        { value: 10 }
      ];
    }
  };
  const scaleY = {
    field: 'b',
    getTicks() {
      return [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
        { value: 10 }
      ];
    }
  };
  const as = new AxisController();

  it('_isHide', function() {
    as.options = {
      a: false
    };
    expect(as._isHide('a')).to.equal(true);
    expect(as._isHide('b')).to.equal(false);
  });

  describe('_getAxisPosition 确定坐标轴的位置', function() {
    it('get axis position rect', function() {
      let position = as._getAxisPosition(coord, 'x');
      expect(position).to.equal('bottom');

      position = as._getAxisPosition(coord, 'y');
      expect(position).to.equal('left');

      position = as._getAxisPosition(coord, 'y', 1);
      expect(position).to.equal('right');
    });

    it('get axis position polar', function() {
      const coord = new Coord.Polar({
        start,
        end
      });

      let position = as._getAxisPosition(coord, 'x');
      expect(position).to.equal('circle');
      position = as._getAxisPosition(coord, 'y');
      expect(position).to.equal('radius');
    });

    it('get axis position polar transpose', function() {
      const coord = new Coord.Polar({
        start,
        end
      });
      coord.transpose();

      let position = as._getAxisPosition(coord, 'x');
      expect(position).to.equal('radius');
      position = as._getAxisPosition(coord, 'y');
      expect(position).to.equal('circle');
    });
  });

  describe('_getLineCfg 获取直线坐标轴配置项信息', function() {
    as.options = null;
    it('_getLineCfg, X axis when position is bottom.', function() {
      const lineCfg = as._getLineCfg(coord, scaleX, 'x');
      expect(lineCfg.isVertical).to.equal(false);
      expect(lineCfg.factor).to.equal(1);
      expect(lineCfg.start).to.eql({ x: 0, y: 500 });
      expect(lineCfg.end).to.eql({ x: 500, y: 500 });
    });

    it('_getLineCfg, X axis when position is top.', function() {
      as.options = {
        a: {
          position: 'top'
        }
      };
      const lineCfg = as._getLineCfg(coord, scaleX, 'x');
      expect(lineCfg.isVertical).to.equal(false);
      expect(lineCfg.factor).to.equal(-1);
      expect(lineCfg.start).to.eql({ x: 0, y: 0 });
      expect(lineCfg.end).to.eql({ x: 500, y: 0 });
    });

    it('_getLineCfg, Y axis when position is left.', function() {
      const lineCfg = as._getLineCfg(coord, scaleY, 'y');
      expect(lineCfg.isVertical).to.equal(true);
      expect(lineCfg.factor).to.equal(-1);
      expect(lineCfg.start).to.eql({ x: 0, y: 500 });
      expect(lineCfg.end).to.eql({ x: 0, y: 0 });
    });

    it('_getLineCfg, Y axis when position is left and index is bigger than 0.', function() {
      as.options = {
        b: {
          position: 'left'
        }
      };
      const lineCfg = as._getLineCfg(coord, scaleY, 'y', 1);
      expect(lineCfg.isVertical).to.equal(true);
      expect(lineCfg.factor).to.equal(-1);
      expect(lineCfg.start).to.eql({ x: 0, y: 500 });
      expect(lineCfg.end).to.eql({ x: 0, y: 0 });
    });

    it('_getLineCfg, Y axis when position is right.', function() {
      as.options = {
        b: {
          position: 'right'
        }
      };
      const lineCfg = as._getLineCfg(coord, scaleY, 'y');
      expect(lineCfg.isVertical).to.equal(true);
      expect(lineCfg.factor).to.equal(1);
      expect(lineCfg.start).to.eql({ x: 500, y: 500 });
      expect(lineCfg.end).to.eql({ x: 500, y: 0 });
    });

    it('_getLineCfg, Y axis when position is right and index is bigger than 0.', function() {
      as.options = {
        b: {
          position: 'right'
        }
      };
      const lineCfg = as._getLineCfg(coord, scaleY, 'y', 1);
      expect(lineCfg.isVertical).to.equal(true);
      expect(lineCfg.factor).to.equal(1);
      expect(lineCfg.start).to.eql({ x: 500, y: 500 });
      expect(lineCfg.end).to.eql({ x: 500, y: 0 });
    });

    it('_getLineCfg, X axis when coord is transposed.', function() {
      const coord = new Coord.Rect({
        start,
        end
      });
      coord.transpose();
      const lineCfg = as._getLineCfg(coord, scaleX, 'x');
      expect(lineCfg.isVertical).to.equal(true);
      expect(lineCfg.factor).to.equal(-1);
      expect(lineCfg.start).to.eql({ x: 0, y: 500 });
      expect(lineCfg.end).to.eql({ x: 0, y: 0 });
    });
  });

  describe('_getCircleCfg 获取圆弧坐标轴配置项信息。', function() {
    it('_getCircleCfg', function() {
      const coord = new Coord.Polar({
        start,
        end
      });
      const circleCfg = as._getCircleCfg(coord);

      expect(circleCfg.startAngle).to.equal(-1.5707963267948966);
      expect(circleCfg.endAngle).to.equal(4.71238898038469);
      expect(circleCfg.radius).to.equal(250);
      expect(circleCfg.inner).to.equal(0);
      expect(circleCfg.center).to.eql({ x: 250, y: 250 });
    });

    it('_getCircleCfg when coord is reflectY.', function() {
      const coord = new Coord.Polar({
        start,
        end,
        startAngle: 1 / (3 * Math.PI),
        endAngle: Math.PI
      });
      coord.reflect('y');
      const circleCfg = as._getCircleCfg(coord);

      expect(circleCfg.startAngle).to.equal(0.10610329539459758);
      expect(circleCfg.endAngle).to.equal(3.141592653589794);
      expect(circleCfg.center).to.eql({
        x: 250.70494165327872,
        y: 124.64752917336064
      });
    });

    it('_getCircleCfg when coord is transposed.', function() {
      const coord = new Coord.Polar({
        start,
        end,
        innerRadius: 0.5
      });
      coord.transpose();

      const circleCfg = as._getCircleCfg(coord);
      expect(circleCfg.startAngle).to.equal(-1.5707963267948966);
      expect(circleCfg.endAngle).to.equal(4.71238898038469);
      expect(circleCfg.radius).to.equal(250);
      expect(circleCfg.inner).to.equal(0.5);
      expect(circleCfg.center).to.eql({
        x: 250,
        y: 250
      });
    });
  });

  describe('_getRadiusCfg 获取半径坐标轴配置项信息。', function() {
    it('_getRadiusCfg', function() {
      const coord = new Coord.Polar({
        start,
        end
      });
      const radiusCfg = as._getRadiusCfg(coord);
      expect(radiusCfg.factor).to.equal(-1);
      expect(radiusCfg.start).to.eql({
        x: 250,
        y: 250
      });
      expect(radiusCfg.end).to.eql({
        x: 250.00000000000003,
        y: 0
      });
    });

    it('_getRadiusCfg when coord is transpose.', function() {
      const coord = new Coord.Polar({
        start,
        end,
        startAngle: 1 / (3 * Math.PI),
        endAngle: Math.PI
      });
      coord.transpose();
      const radiusCfg = as._getRadiusCfg(coord);
      expect(radiusCfg.factor).to.equal(1);
      expect(radiusCfg.start).to.eql({
        x: 250.70494165327872,
        y: 124.64752917336064
      });
      expect(radiusCfg.end).to.eql({
        x: 500.00000000000006,
        y: 151.1982665130035
      });
    });
  });

  describe('_getHelixCfg ', function() {
    it('_getHelixCfg', function() {
      const coord = new Coord.Helix({
        start,
        end
      });
      const helixCfg = as._getHelixCfg(coord);
      expect(helixCfg.crp.length).to.equal(202);
    });
  });

  describe('_getAxisCfg 常规逻辑测试。', function() {
    it('_getAxisCfg', function() {
      const axisCfg = as._getAxisCfg(coord, scaleX, scaleY, 'x');
      expect(axisCfg.label.autoRotate).to.equal(true);
      expect(axisCfg.position).to.equal('bottom');
      expect(axisCfg.ticks.length).to.equal(10);
      // expect(axisCfg.title.text).to.equal('a');
      expect(axisCfg.title).to.be.null;
    });
    it('_getAxisCfg when gridAlign is middle.', function() {
      as.options = {
        b: {
          grid: {
            align: 'center'
          }
        }
      };
      const coord = new Coord.Polar({
        start,
        end
      });
      coord.reflect('y');
      const axisCfg = as._getAxisCfg(coord, scaleY, scaleX, 'y');

      expect(axisCfg.ticks.length).to.equal(10);
      expect(axisCfg.grid).not.to.be.empty;
      expect(axisCfg.grid.type).to.equal('circle');
      expect(axisCfg.grid.items.length).to.equal(12); // fixed: fill gaps
      expect(axisCfg.grid.items[0]._id).not.to.be.undefined;
      expect(axisCfg.grid.items[0].points.length).to.equal(12);
    });
  });
});
