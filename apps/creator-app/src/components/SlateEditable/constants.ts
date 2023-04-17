import { ElementProperty, ElementType, TextProperty } from '@voiceflow/base-types/build/esm/text';

import { Color } from './editor/types';

export { ElementProperty, ElementType, TextProperty };

export const DEFAULT_COLOR: Color = { r: 59, g: 64, b: 66, a: 1 };

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
