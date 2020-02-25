import { getCoordinate } from '@antv/coord';
import { DIRECTION } from '../../../src';
import {
  getAxisDirection,
  getAxisFactor,
  getAxisFactorByRegion,
  getAxisTitleText,
  getLineAxisRelativeRegion,
} from '../../../src/util/axis';
import { createScaleByField, getName } from '../../../src/util/scale';

const Rect = getCoordinate('rect');

describe('util axis', () => {
  it('getAxisFactor', () => {
    const rect = new Rect({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    });

    expect(getAxisFactor(rect, DIRECTION.LEFT)).toBe(1);
    expect(getAxisFactor(rect, DIRECTION.BOTTOM)).toBe(-1);
    expect(getAxisFactor(rect, DIRECTION.RIGHT)).toBe(-1);
    expect(getAxisFactor(rect, DIRECTION.TOP)).toBe(1);

    const rectWithTranspose = new Rect({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    }).transpose();

    expect(getAxisFactor(rectWithTranspose, DIRECTION.LEFT)).toBe(-1);
    expect(getAxisFactor(rectWithTranspose, DIRECTION.BOTTOM)).toBe(1);
    expect(getAxisFactor(rectWithTranspose, DIRECTION.RIGHT)).toBe(1);
    expect(getAxisFactor(rectWithTranspose, DIRECTION.TOP)).toBe(-1);
  });

  it('getAxisFactorByRegion', () => {
    const center = { x: 50, y: 50 };

    // 顺时针
    expect(
      getAxisFactorByRegion(
        {
          start: { x: 0, y: 100 },
          end: { x: 0, y: 0 },
        },
        center
      )
    ).toBe(1);
    expect(
      getAxisFactorByRegion(
        {
          start: { x: 0, y: 0 },
          end: { x: 100, y: 0 },
        },
        center
      )
    ).toBe(1);
    expect(
      getAxisFactorByRegion(
        {
          start: { x: 100, y: 0 },
          end: { x: 100, y: 100 },
        },
        center
      )
    ).toBe(1);
    expect(
      getAxisFactorByRegion(
        {
          start: { x: 100, y: 100 },
          end: { x: 0, y: 100 },
        },
        center
      )
    ).toBe(1);

    // 逆时针
    expect(
      getAxisFactorByRegion(
        {
          end: { x: 0, y: 100 },
          start: { x: 0, y: 0 },
        },
        center
      )
    ).toBe(-1);
    expect(
      getAxisFactorByRegion(
        {
          end: { x: 0, y: 0 },
          start: { x: 100, y: 0 },
        },
        center
      )
    ).toBe(-1);
    expect(
      getAxisFactorByRegion(
        {
          end: { x: 100, y: 0 },
          start: { x: 100, y: 100 },
        },
        center
      )
    ).toBe(-1);
    expect(
      getAxisFactorByRegion(
        {
          end: { x: 100, y: 100 },
          start: { x: 0, y: 100 },
        },
        center
      )
    ).toBe(-1);
  });

  it('getAxisRelativeRegion', () => {
    expect(getLineAxisRelativeRegion(DIRECTION.LEFT)).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    });
    expect(getLineAxisRelativeRegion(DIRECTION.BOTTOM)).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    });
    expect(getLineAxisRelativeRegion(DIRECTION.RIGHT)).toEqual({
      start: { x: 1, y: 0 },
      end: { x: 1, y: 1 },
    });
    expect(getLineAxisRelativeRegion(DIRECTION.TOP)).toEqual({
      start: { x: 0, y: 1 },
      end: { x: 1, y: 1 },
    });
    // @ts-ignore
    expect(getLineAxisRelativeRegion('xxx')).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    });
  });

  it('getAxisDirection', () => {
    expect(getAxisDirection(false, DIRECTION.BOTTOM)).toBe(DIRECTION.BOTTOM);
    expect(getAxisDirection({}, DIRECTION.TOP)).toBe(DIRECTION.TOP);
    expect(getAxisDirection({ position: 'top' }, DIRECTION.BOTTOM)).toBe(DIRECTION.TOP);
    // @ts-ignore
    expect(getAxisDirection({ position: 'xxx' }, DIRECTION.BOTTOM)).toBe('xxx');
  });

  it('getAxisTitleText', () => {
    const scale = createScaleByField('b', [], { alias: '字段 B' });
    expect(getAxisTitleText(scale, { title: {} })).toBe('字段 B');
    // @ts-ignore
    expect(getAxisTitleText(scale, { title: { text: '字段 A' } })).toBe('字段 A');
  });
});
