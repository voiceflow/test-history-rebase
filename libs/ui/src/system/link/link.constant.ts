import { Color } from './link.enum';

export const PROTOCOL_POSTFIX_REGEXP = /(:?\/\/|mailto:[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,})/;

export const ACTIVE_COLOR_MAP: Record<Color, string> = {
  [Color.DARK]: '#5E96E4',
  [Color.INHERIT]: 'inherit',
  [Color.DEFAULT]: '#3876CB',
};

export const BUILT_IN_COLORS = new Set<string>(Object.values(Color));
