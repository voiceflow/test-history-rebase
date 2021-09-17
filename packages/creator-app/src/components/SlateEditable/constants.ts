import { Color } from './editor/types';

export { ElementProperty, ElementType, TextProperty } from '@voiceflow/base-types/build/text';

export const DEFAULT_COLOR: Color = { r: 19, g: 33, b: 68, a: 1 };

export enum Hotkey {
  NOOP = '',
  BOLD = 'b',
  LINK = 'k',
  ITALIC = 'i',
  UNDERLINE = 'u',
  STRIKE_THROUGH = 's',
}

export enum Plugins {
  LINKS = 'LINKS',
  VARIABLES = 'VARIABLES',
}
