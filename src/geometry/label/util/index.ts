/**
 * @file utils of label
 */
import { IGroup } from '@antv/g-base';
import { isNil, isNumber } from '@antv/util';
import { rotate } from '../../../util/transform';
import { LabelItem } from '../interface';

/**
 * 获取标签背景信息: box (无旋转) + rotation (旋转角度)
 */
export function getlLabelBackgroundInfo(
  labelGroup: IGroup,
  labelItem: LabelItem,
  padding: number | number[] = [0, 0, 0, 0]
): { x: number; y: number; width: number; height: number; rotation: number } {
  const content = labelGroup.getChildren()[0];
  if (content) {
    const labelShape = content.clone();

    // revert rotate
    if (labelItem.rotate) {
      rotate(labelShape as IGroup, -labelItem.rotate);
    }

    // use `getCanvasBBox`, because if Shape is been translated, `getBBox` is not the actual box position
    const { x, y, width, height } = labelShape.getCanvasBBox();

    labelShape.destroy();

    let boxPadding = padding;
    if (isNil(boxPadding)) {
      boxPadding = [2, 2, 2, 2];
    } else if (isNumber(boxPadding)) {
      boxPadding = new Array(4).fill(boxPadding);
    }

    return {
      x: x - boxPadding[3],
      y: y - boxPadding[0],
      width: width + boxPadding[1] + boxPadding[3],
      height: height + boxPadding[0] + boxPadding[2],
      rotation: labelItem.rotate || 0,
    };
  }
}
