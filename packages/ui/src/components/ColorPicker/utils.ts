import { isHexColor, isRGBColor, RGBAToHex } from '@ui/utils/colors';
import { createStandardShadeFromHue, HSLShades, STANDARD_GRADE } from '@ui/utils/colors/hsl';

import { ALL_COLORS } from './constants';

export const pickRandomDefaultColor = (): string => ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)].palette[500];
export const isDefaultColor = (color: string): boolean => ALL_COLORS.some(({ palette }) => Object.values(palette).some((val) => val === color));
export const isBaseColor = (color: string): boolean => ALL_COLORS.some(({ palette }) => Object.values(palette).some((val) => val === color));
export const getStandardShade = (hue: string, palette: HSLShades): string =>
  isDefaultColor(palette[STANDARD_GRADE]) ? palette[STANDARD_GRADE] : createStandardShadeFromHue(hue);

export const normalizeColor = (color: string | undefined): string => {
  if (!color) return ALL_COLORS[0].palette[STANDARD_GRADE];

  if (isRGBColor(color)) return RGBAToHex(color);

  if (isHexColor(color)) return color;

  const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

  ctx.fillStyle = color;

  return ctx.fillStyle;
};
