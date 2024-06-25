import { hsluvToHex } from './hsluv';

export const SATURATION: number = 50;
export const LOW_SATURATION: number = 25;
export const SHADES = [94, 90, 85, 80, 72, 64, 55, 44, 32, 19];
export const COLOR_GRADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

export const STANDARD_INDEX = 5;
export const STANDARD_GRADE = COLOR_GRADES[STANDARD_INDEX];
export const STANDARD_SHADE = SHADES[STANDARD_INDEX];

export const HUE_MIN = 1;
export const HUE_MAX = 360;

export type HSLShades = {
  [key in (typeof COLOR_GRADES)[number]]: string;
};
export type Hue = string | number;

const normalizeHue = (hue: Hue) => {
  const normailzedHue = Number(hue);

  if (normailzedHue > HUE_MAX) return HUE_MAX;
  if (normailzedHue < HUE_MIN) return HUE_MIN;

  return normailzedHue;
};

const createHSLuvShade = (shade: number, hue: Hue) => hsluvToHex([Number(normalizeHue(hue)), SATURATION, shade]);

const createHSLuvShadeWithDynamicSaturation = (shade: number, hue: Hue) => {
  const adaptableSaturation = Number(hue) > 60 && Number(hue) < 218 ? LOW_SATURATION : SATURATION;

  return hsluvToHex([Number(normalizeHue(hue)), adaptableSaturation, shade]);
};

export const createShadesFromHue = (hue: Hue): HSLShades =>
  SHADES.reduce((acc, shade, i) => ({ ...acc, [COLOR_GRADES[i]]: createHSLuvShade(shade, hue) }), {} as HSLShades);

export const createShadesFromHueWithDynamicSaturation = (hue: Hue): HSLShades =>
  SHADES.reduce(
    (acc, shade, i) => ({ ...acc, [COLOR_GRADES[i]]: createHSLuvShadeWithDynamicSaturation(shade, hue) }),
    {} as HSLShades
  );

export const createStandardShadeFromHue = (hue: Hue): string => createHSLuvShade(STANDARD_SHADE, hue);
