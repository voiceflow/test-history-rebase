import { isHexColor, isRGBColor, RGBAToHex } from '@ui/utils/colors';
import { createStandardShadeFromHue, HSLShades, STANDARD_GRADE } from '@ui/utils/colors/hsl';
import { hexToHsluv } from '@ui/utils/colors/hsluv';

import { ALL_COLORS, LegacyBlockVariant } from './constants';

export const pickRandomDefaultColor = (): string => ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)].palette[500];
export const isDefaultColor = (color: string): boolean => ALL_COLORS.some(({ palette }) => Object.values(palette).some((val) => val === color));
export const isBaseColor = (color: string): boolean =>
  ALL_COLORS.slice(0, 4).some(({ palette }) => Object.values(palette).some((val) => val === color));
export const getStandardShade = (hue: string, palette: HSLShades): string =>
  isDefaultColor(palette[STANDARD_GRADE]) ? palette[STANDARD_GRADE] : createStandardShadeFromHue(hue);
export const hexToHue = (color: string) => hexToHsluv(color)[0];

export const normalizeColor = (color: string): string => {
  if (isRGBColor(color)) return RGBAToHex(color);

  if (isHexColor(color)) return color;

  if (Object.keys(LegacyBlockVariant).includes(color)) return LegacyBlockVariant[color];

  const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

  ctx.fillStyle = color;

  return ctx.fillStyle;
};
