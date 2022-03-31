import { hsluvToHex } from './hsluv';

export const SATURATION = 65;
export const SHADES = [94, 90, 85, 80, 72, 64, 55, 44, 32, 19];
export const COLOR_GRADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const STANDARD_INDEX = 5;
export const STANDARD_GRADE = COLOR_GRADES[STANDARD_INDEX];
export const STANDARD_SHADE = SHADES[STANDARD_INDEX];

export const HUE_MIN = 1;
export const HUE_MAX = 360;

export type HSLShades = Record<string, string>;
export type Hue = string | number;

const normalizeHue = (hue: Hue) => {
  const normailzedHue = Number(hue);

  if (normailzedHue > HUE_MAX) return HUE_MAX;
  if (normailzedHue < HUE_MIN) return HUE_MIN;

  return normailzedHue;
};

const createHSLuvShade = (shade: number, hue: Hue) => hsluvToHex([Number(normalizeHue(hue)), SATURATION, shade]);

export const createShadesFromHue = (hue: Hue): HSLShades =>
  SHADES.reduce((acc, shade, i) => ({ ...acc, [COLOR_GRADES[i]]: createHSLuvShade(shade, hue) }), {});

export const createStandardShadeFromHue = (hue: Hue): string => createHSLuvShade(STANDARD_SHADE, hue);
