import { hsluvToHex } from './hsluv';

export const SATURATION = 65;
export const SHADES = [94, 90, 85, 80, 72, 64, 55, 44, 32, 19];
export const COLOR_GRADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const HUE_MIN = 0;
export const HUE_MAX = 360;

export type HSLShades = Record<string, string>;

const normalizeHue = (hue: string) => {
  if (Number(hue) > HUE_MAX) return HUE_MAX;
  if (Number(hue) < HUE_MIN) return HUE_MIN;
  return hue;
};

export const createHEXShadesFromHSL = (hue: string): HSLShades =>
  SHADES.reduce((acc, shade, i) => ({ ...acc, [COLOR_GRADES[i]]: hsluvToHex([Number(normalizeHue(hue)), SATURATION, shade]) }), {});
