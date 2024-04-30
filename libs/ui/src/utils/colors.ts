/* eslint-disable no-bitwise */
import { PROFILE_COLORS } from '@/styles/colors';
import type { Color } from '@/types';

export const colorGetReadableAlfa = (color: Color): string => `${(color?.a ?? 1) * 100}`;

export const colorReadableAlfaToOpacity = (value: string): number => Math.min(+value / 100, 1);

export const getAlternativeColor = (id: number | string) => {
  const index =
    String(id)
      .split('')
      .map((c) => c.charCodeAt(0))
      .reduce((acc, code) => acc + code) % PROFILE_COLORS.length;

  return PROFILE_COLORS[index];
};

export const toHexString = (hexValue: number) => Math.round(hexValue).toString(16).padStart(2, '0');

export const rgbaToHex = (color: Color) =>
  `#${toHexString(color.r)}${toHexString(color.g)}${toHexString(color.b)}${toHexString(color.a * 0xff)}`;

export const toRGBAString = (color: Color) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

export const hexToRGBA = (color: string) => {
  if (color.length !== 7 && color.length !== 9) {
    throw new Error('hex string must be 7 or 9 characters long');
  }

  return {
    r: parseInt(color.substr(1, 2), 16),
    g: parseInt(color.substr(3, 2), 16),
    b: parseInt(color.substr(5, 2), 16),
    a: color.length === 9 ? parseInt(color.substr(7, 2), 16) / 0xff : 1,
  };
};

const RGBA_REGEX = /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i;
const HEX_REGEX = /^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i;

export const isHexColor = (color: string): boolean => RegExp(HEX_REGEX).test(color);
export const isRGBColor = (color: string): boolean => RegExp(RGBA_REGEX).test(color);

export const RGBAToHex = (rgba: string): string => {
  const parsedRGBA = rgba.match(RGBA_REGEX);
  const parseSubcolor = (subcolor: string) => `0${parseInt(subcolor, 10).toString(16)}`.slice(-2);

  if (parsedRGBA && parsedRGBA.length === 4) {
    return `#${parseSubcolor(parsedRGBA[1])}${parseSubcolor(parsedRGBA[2])}${parseSubcolor(parsedRGBA[3])}`;
  }

  return '';
};

const clamp = (value: number, min: number, max: number) => Math.max(Math.min(value, max), min);

export const changeColorShade = (col: string, amt: number) => {
  let usePound = false;
  let color = col;

  if (col === 'inherit') return 'inherit';

  if (col[0] === '#') {
    color = col.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);

  const r = clamp((num >> 16) + amt, 0, 255);
  const g = clamp(((num >> 8) & 0x00ff) + amt, 0, 255);
  const b = clamp((num & 0x0000ff) + amt, 0, 255);

  const newColor = `000000${(b | (g << 8) | (r << 16)).toString(16)}`;

  return (usePound ? '#' : '') + newColor.substr(newColor.length - 6);
};

export const removeHashFromHex = (hex: string) => (hex.startsWith('#') ? hex.substr(1) : hex);
