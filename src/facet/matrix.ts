import { deepMix, each } from '@antv/util';
import { AxisCfg } from '../chart/interface';
import View from '../chart/view';
import { DIRECTION } from '../constant';
import { Datum } from '../interface';
import { getFactTitleConfig } from '../util/facet';
import { Facet } from './facet';
import { MatrixCfg, MatrixData } from './interface';

/**
 * 镜像分面
 */
export default class Matrix extends Facet<MatrixCfg, MatrixData> {
  protected getDefaultCfg() {
    // @ts-ignore
    const fontFamily = this.view.getTheme().fontFamily;
    return deepMix({}, super.getDefaultCfg(), {
      type: 'matrix',
      showTitle: false,
      columnTitle: {
        style: {
          fontSize: 14,
          fill: '#666',
          fontFamily,
        }
      },
      rowTitle: {
        style: {
          fontSize: 14,
          fill: '#666',
          fontFamily,
        }
      }
    });
  }

  public render() {
    super.render();

    if (this.cfg.showTitle) {
      this.renderTitle();
    }
  }

  protected afterEachView(view: View, facet: MatrixData) {
    this.processAxis(view, facet);
  }

  protected beforeEachView(view: View, facet: MatrixData) {
  }

  protected generateFacets(data: Datum[]): MatrixData[] {
    const { fields, type } = this.cfg;

    // 矩阵中行列相等，等于指定的字段个数
    const rowValuesLength = fields.length;
    const columnValuesLength = rowValuesLength;

    const rst = [];
    for (let i = 0; i < columnValuesLength; i ++) {
      const columnField = fields[i];
      for (let j = 0; j < rowValuesLength; j ++) {
        const rowField = fields[j];

        const facet: MatrixData = {
          type,
          data,
          region: this.getRegion(rowValuesLength, columnValuesLength, i, j),

          columnValue: columnField,
          rowValue: rowField,
          columnField,
          rowField,
          columnIndex: i,
          rowIndex: j,
          columnValuesLength,
          rowValuesLength,
        };
        rst.push(facet);
      }
    }
    return rst;
  }

  /**
   * 设置 x 坐标轴的文本、title 是否显示
   * @param x
   * @param axes
   * @param option
   * @param facet
   */
  protected getXAxisOption(x: string, axes: any, option: AxisCfg, facet: MatrixData): object {
    // 最后一行显示
    if (facet.rowIndex !== facet.rowValuesLength - 1) {
      return {
        ...option,
        label: null,
        title: null,
      };
    }
    return option;
  }


  /**
   * 设置 y 坐标轴的文本、title 是否显示
   * @param y
   * @param axes
   * @param option
   * @param facet
   */
  protected getYAxisOption(y: string, axes: any, option: AxisCfg, facet: MatrixData): object {
    // 第一列显示
    if (facet.columnIndex !== 0) {
      return {
        ...option,
        title: null,
        label: null,
      };
    }
    return option;
  }

  /**
   * facet title
   */
  private renderTitle() {
    each(this.facets, (facet: MatrixData, facetIndex: number) => {
      const { columnIndex, rowIndex, columnValuesLength, rowValuesLength, columnValue, rowValue, view } = facet;

      // top
      if (rowIndex === 0) {
        const config = deepMix({
          position: [ '50%', '0%' ] as [string, string],
          content: columnValue,
        }, getFactTitleConfig(DIRECTION.TOP), this.cfg.columnTitle);

        view.annotation().text(config);
      }
      // right
      if (columnIndex === columnValuesLength - 1) {
        const config = deepMix({
          position: [ '100%', '50%' ] as [string, string],
          content: rowValue,
        }, getFactTitleConfig(DIRECTION.RIGHT), this.cfg.rowTitle);

        view.annotation().text(config);
      }
    });
  }
}
