import { PROFILE_COLORS } from '@/styles/colors';
import { Color } from '@/types';

export const getAlternativeColor = (id: number | string) => {
  const index =
    String(id)
      .split('')
      .map((c) => c.charCodeAt(0))
      .reduce((acc, code) => acc + code) % PROFILE_COLORS.length;

  return PROFILE_COLORS[index];
};

export const toHexString = (hexValue: number) => Math.round(hexValue).toString(16).padStart(2, '0');

export const rgbaToHex = (color: Color) => `#${toHexString(color.r)}${toHexString(color.g)}${toHexString(color.b)}${toHexString(color.a * 0xff)}`;

export const hexToRGBA = (color: string) => {
  if (color.length !== 9) {
    throw new Error('hex string must be 9 characters long');
  }

  return {
    r: parseInt(color.substr(1, 2), 16),
    g: parseInt(color.substr(3, 2), 16),
    b: parseInt(color.substr(5, 2), 16),
    a: parseInt(color.substr(7, 2), 16) / 0xff,
  };
};
