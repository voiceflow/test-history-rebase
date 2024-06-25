export enum HandlePosition {
  TOP = 'top',
  TOP_RIGHT = 'topRight',
  RIGHT = 'right',
  BOTTOM_RIGHT = 'bottomRight',
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottomLeft',
  LEFT = 'left',
  TOP_LEFT = 'topLEFT',
}

export const SCALE_HANDLES = [
  HandlePosition.TOP_LEFT,
  HandlePosition.TOP_RIGHT,
  HandlePosition.BOTTOM_LEFT,
  HandlePosition.BOTTOM_RIGHT,
];
export const HORIZONTAL_HANDLES = [HandlePosition.LEFT, HandlePosition.RIGHT];
export const VERTICAL_HANDLES = [HandlePosition.TOP, HandlePosition.BOTTOM];
export const X_INVERTED_HANDLES = [HandlePosition.LEFT, HandlePosition.TOP_LEFT, HandlePosition.BOTTOM_LEFT];
export const Y_INVERTED_HANDLES = [HandlePosition.TOP, HandlePosition.TOP_LEFT, HandlePosition.TOP_RIGHT];

export const IMAGE_HANDLES = [
  HandlePosition.TOP,
  HandlePosition.RIGHT,
  HandlePosition.BOTTOM,
  HandlePosition.LEFT,
  ...SCALE_HANDLES,
];

export const TEXT_WIDTH_HANDLES = [HandlePosition.RIGHT, HandlePosition.LEFT];

export const TEXT_HANDLES = [...TEXT_WIDTH_HANDLES, ...SCALE_HANDLES];
