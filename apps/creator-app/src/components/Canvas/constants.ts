import { Identifier } from '@/styles/constants';

export const CANVAS_BUSY_CLASSNAME = `${Identifier.CANVAS}--busy`;
export const CANVAS_INTERACTING_CLASSNAME = `${Identifier.CANVAS}--interacting`;
export const CANVAS_ANIMATING_CLASSNAME = `${Identifier.CANVAS}--animating`;
export const CANVAS_SHIFT_PRESSED_CLASSNAME = `${Identifier.CANVAS}--shift-pressed`;

export const ZOOM_FACTOR = 100;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 200;

export const SCROLL_FACTOR = 60;
export const PINCH_SCROLL_FACTOR = 3;

export const MAX_CLICK_TRAVEL = 10;
export const SCROLL_TIMEOUT = 500;
export const ANIMATION_TIMEOUT = 250;

export enum ControlScheme {
  MOUSE = 'MOUSE',
  TRACKPAD = 'TRACKPAD',
}

export enum ZoomType {
  REGULAR = 'REGULAR',
  INVERSE = 'INVERSE',
}

export enum ControlType {
  START_INTERACTION = 'START_INTERACTION',
  END_INTERACTION = 'END_INTERACTION',
  SCALE = 'SCALE',
  PAN = 'PAN',
  CLICK = 'CLICK',
  END = 'END',
  MOUSE_UP = 'MOUSE_UP',
  SELECT_DRAG_START = 'SELECT_DRAG_START',
  START_PANNING = 'START_PANNING',
  STOP_PANNING = 'STOP_PANNING',
}
