import { Chart } from '../../../src/';
import { COMPONENT_TYPE } from '../../../src/constant';
import { GroupComponent, GroupComponentCfg } from '../../../src/dependents';
import { CITY_SALE, DIAMOND } from '../../util/data';
import { createDiv, removeDom } from '../../util/dom';

describe('Legend category', () => {
  const div = createDiv();

  const chart = new Chart({
    container: div,
    width: 800,
    height: 600,
    autoFit: false,
  });

  chart.animate(false);

  chart.data(CITY_SALE);

  chart.interval().position('city*sale').color('category').adjust({ type: 'dodge' });

  it('close legend', () => {
    chart.legend(false);
    chart.render();
    const legends = chart.getComponents().filter((co) => co.type === COMPONENT_TYPE.LEGEND);
    expect(legends.length).toBe(0);
  });

  it('legend component', () => {
    chart.legend('category', {
      position: 'right',
    });

    chart.render();
    const legends = chart.getComponents().filter((co) => co.type === COMPONENT_TYPE.LEGEND);
    expect(legends.length).toBe(1);

    const legend = legends[0].component;
    // @ts-ignore
    const items: any[] = legend.get('items');

    // two legend items
    expect(items.length).toBe(2);

    // legend item style
    expect(items[0].name).toBe('电脑');
    expect(items[1].name).toBe('鼠标');
    expect(items[0].marker.style.fill).toBe('#5B8FF9');
    expect(items[1].marker.style.fill).toBe('#5AD8A6');

    // position
    // @ts-ignore
    const x: any[] = legend.get('x');

    // right
    expect(x).toBeGreaterThan(700);

    expect(chart.autoPadding.length).toBe(4);
    expect(chart.autoPadding[0]).toBe(6);
    expect(chart.autoPadding[1]).toBe(40);
    expect(chart.autoPadding[2]).toBe(28);
    expect(chart.autoPadding[3]).toBeCloseTo(28.2659912109375);
  });
});

describe('Legend category navigation', () => {
  const div = createDiv();
  const legendId = '';

  const chart = new Chart({
    container: div,
    width: 400,
    height: 400,
    autoFit: false,
  });

  chart.data(DIAMOND);

  chart.interval().position('cut*price').color('clarity').adjust({ type: 'dodge' });

  it('navigation horizontal', () => {
    chart.legend('clarity', {
      position: 'bottom',
      flipPage: true,
    });
    chart.render();

    const legends = chart.getComponents().filter((co) => co.type === COMPONENT_TYPE.LEGEND);
    const legend = legends[0].component as GroupComponent<GroupComponentCfg>;
    const navigation = legend.getElementById(`${legendId}-legend-navigation-group`);
    const children = navigation ? navigation.getChildren() : [];

    expect(legends.length).toBe(1);
    expect(children).toHaveLength(3);

    // left arrow: /\
    expect(children[0].get('type')).toBe('path');
    expect(children[0].attr('matrix')).toBeNull();

    // text
    expect(children[1].get('type')).toBe('text');
    expect(children[1].attr('text')).toEqual('1/2');
  });

  it('navigation off', () => {
    chart.legend('clarity', {
      position: 'bottom',
      flipPage: false,
    });
    chart.render();

    const legends = chart.getComponents().filter((co) => co.type === COMPONENT_TYPE.LEGEND);
    const legend = legends[0].component as GroupComponent<GroupComponentCfg>;
    const navigation = legend.getElementById(`${legendId}-legend-navigation-group`);

    expect(navigation).toBeUndefined();
  });
});

describe('Legend Category Vertical', () => {
  const div = createDiv();
  const legendId = '';

  const chart = new Chart({
    container: div,
    width: 400,
    height: 400,
  });

  chart.data(DIAMOND);

  chart.interval().position('cut*price').color('clarity').adjust({ type: 'dodge' });

  it('navigation vertical', () => {
    chart.legend('clarity', {
      position: 'right',
      flipPage: true,
      maxHeight: 80,
    });
    chart.render();

    const legends = chart.getComponents().filter((co) => co.type === COMPONENT_TYPE.LEGEND);
    const legend = legends[0].component as GroupComponent<GroupComponentCfg>;

    expect(legend.get('maxHeight')).toBe(80);
    expect(legend.get('y')).toBeGreaterThan(0);

    const navigation = legend.getElementById(`${legendId}-legend-navigation-group`);

    const children = navigation ? navigation.getChildren() : [];

    expect(legends.length).toBe(1);
    expect(children).toHaveLength(3);

    // text
    expect(children[1].get('type')).toBe('text');
    expect(children[1].attr('text')).toEqual('1/3');
  });
});

describe('Legend auto ellipsis', () => {
  const div = createDiv();
  const data = [
    { genre: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试1', sold: 100 },
    { genre: '测试测试2', sold: null },
    { genre: '测试测试3', sold: 45 },
    { genre: '测试测试4', sold: 100 },
    { genre: '测试测试5', sold: 100 },
    { genre: '测试测试6', sold: 100 },
    { genre: '测试测试7', sold: 100 },
    { genre: '测试测试8', sold: 100 },
    { genre: '测试测试9', sold: 100 },
    { genre: '测试测试10', sold: 100 },
    { genre: '测试测试11', sold: 100 },
    { genre: '测试测试12', sold: 100 },
    { genre: '测试测试13', sold: 100 },
  ];
  const chart = new Chart({
    container: div,
    width: 400,
    height: 300,
  });

  it('vertical ellipsis', () => {
    chart.data(data);
    chart.animate(false);
    chart.legend({
      layout: 'vertical',
      position: 'right-top',
    });
    chart.interval().position('genre*sold').color('genre');
    chart.render();

    const legends = chart.getComponents().filter((co) => co.type === COMPONENT_TYPE.LEGEND);
    const legend = legends[0].component as GroupComponent<GroupComponentCfg>;
    expect(legend.get('maxItemWidth')).toBe(80);
    expect(
      legend.getElementById('-legend-item-测试测试测试测试测试测试测试测试测试测试测试测试测试测试1-name').attr('text')
    ).toBe('测试测试…');
  });

  it('itemWidth', () => {
    chart.legend({
      layout: 'horizontal',
      position: 'top',
      itemWidth: 60,
    });
    chart.render(true);

    const legends = chart.getComponents().filter((co) => co.type === COMPONENT_TYPE.LEGEND);
    const legend = legends[0].component as GroupComponent<GroupComponentCfg>;
    expect(legend.get('maxItemWidth')).toBe(80);
    expect(legend.get('itemWidth')).toBe(60);
    expect(
      legend.getElementById('-legend-item-测试测试测试测试测试测试测试测试测试测试测试测试测试测试1-name').attr('text')
    ).toBe('测试…');

    expect(legend.getElementById('-legend-item-测试测试4').getBBox().width).toBeLessThan(60);
  });

  afterAll(() => {
    chart.destroy();
    removeDom(div);
  });
});
