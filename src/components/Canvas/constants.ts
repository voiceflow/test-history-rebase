import { Identifier } from '@/styles/constants';

export const CANVAS_BUSY_CLASSNAME = `${Identifier.CANVAS}--busy`;
export const CANVAS_ANIMATING_CLASSNAME = `${Identifier.CANVAS}--animating`;

export const ZOOM_FACTOR = 100;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 200;

export const SCROLL_FACTOR = 60;
export const PINCH_SCROLL_FACTOR = 3;

export const MAX_CLICK_TRAVEL = 10;
export const SCROLL_TIMEOUT = 500;
export const ANIMATION_TIMEOUT = 250;

export enum ControlScheme {
  TRACKPAD = 'TRACKPAD',
  MOUSE = 'MOUSE',
}

export enum ControlType {
  START_ANIMATE = 'START_ANIMATE',
  END_ANIMATE = 'END_ANIMATE',
  SCALE = 'SCALE',
  PAN = 'PAN',
  CLICK = 'CLICK',
  END = 'END',
  MOUSE_UP = 'MOUSE_UP',
  SHIFT_DRAG_START = 'SHIFT_DRAG_START',
}
