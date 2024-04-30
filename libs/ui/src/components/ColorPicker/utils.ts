import _sample from 'lodash/sample';

import { isHexColor, isRGBColor, RGBAToHex } from '@/utils/colors';
import type { HSLShades } from '@/utils/colors/hsl';
import { createShadesFromHue, createStandardShadeFromHue, STANDARD_GRADE } from '@/utils/colors/hsl';
import { hexToHsluv } from '@/utils/colors/hsluv';

import type { Colors } from './constants';
import { ALL_COLORS, BASE_COLORS, DEFAULT_SCHEME_COLORS, LegacyBlockVariant } from './constants';

const ALL_PALETTES_COLORS = ALL_COLORS.flatMap(({ palette }) => Object.values(palette));
const BASE_AND_SCHEME_PALETTES_COLORS = [...Object.values(DEFAULT_SCHEME_COLORS), ...BASE_COLORS].flatMap(
  ({ palette }) => Object.values(palette)
);

export const isDefaultColor = (color: string): boolean => ALL_PALETTES_COLORS.some((val) => val === color);

export const isBaseOrSchemeColor = (color: string): boolean =>
  BASE_AND_SCHEME_PALETTES_COLORS.some((val) => val === color);

export const pickRandomDefaultColor = (colors: Colors = ALL_COLORS): string =>
  _sample(colors)?.palette[500] ?? colors[0].palette[500];

export const hexToHue = (color: string) => hexToHsluv(color)[0];

export const getStandardShade = (palette: HSLShades, color: string): string =>
  isDefaultColor(palette[STANDARD_GRADE]) ? palette[STANDARD_GRADE] : createStandardShadeFromHue(hexToHue(color));

export const normalizeColor = (color: string): string => {
  if (isRGBColor(color)) return RGBAToHex(color);

  if (isHexColor(color)) return color;

  if (Object.keys(LegacyBlockVariant).includes(color)) return LegacyBlockVariant[color];

  const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

  ctx.fillStyle = color;

  return ctx.fillStyle;
};

export const createShadesFromColor = (color: string) => {
  const normalizedColor = normalizeColor(color);
  const isDefaultColor = ALL_COLORS.find(({ standardColor }) => standardColor === normalizedColor);

  return isDefaultColor?.palette || createShadesFromHue(String(hexToHsluv(normalizedColor)[0]));
};
