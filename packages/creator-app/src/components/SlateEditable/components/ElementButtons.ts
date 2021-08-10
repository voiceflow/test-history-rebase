import { ElementProperty } from '../constants';
import { createElementPropertyButton } from './utils';

enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export const ElementAlignLeftButton = createElementPropertyButton({
  icon: 'textAlignLeft',
  value: TextAlign.LEFT,
  property: ElementProperty.TEXT_ALIGN,
  nullable: true,
});

export const ElementAlignCenterButton = createElementPropertyButton({
  icon: 'textAlignCenter',
  value: TextAlign.CENTER,
  property: ElementProperty.TEXT_ALIGN,
});

export const ElementAlignRightButton = createElementPropertyButton({
  icon: 'textAlignRight',
  value: TextAlign.RIGHT,
  property: ElementProperty.TEXT_ALIGN,
});
