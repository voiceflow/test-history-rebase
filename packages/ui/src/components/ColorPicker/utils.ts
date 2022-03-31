import { createStandardShadeFromHue, HSLShades, STANDARD_GRADE } from '@ui/utils/colors/hsl';

import { BASE_COLORS, DEFAULT_COLORS } from './constants';

export const pickRandomDefaultColor = (): string => BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)].palette[500];
export const isDefaultColor = (color: string): boolean => DEFAULT_COLORS.some(({ palette }) => Object.values(palette).some((val) => val === color));
export const isBaseColor = (color: string): boolean => BASE_COLORS.some(({ palette }) => Object.values(palette).some((val) => val === color));
export const getStandardShade = (hue: string, palette: HSLShades): string =>
  isDefaultColor(palette[STANDARD_GRADE]) ? palette[STANDARD_GRADE] : createStandardShadeFromHue(hue);
