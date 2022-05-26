import { COLOR_GRADES, HSLShades as shades, STANDARD_GRADE } from '@ui/utils/colors/hsl';

export type HSLShades = shades;
export interface IColor {
  palette: HSLShades;
  editing?: boolean;
  name?: string;
  hue: string;
}

export type Colors = Array<IColor>;

const createCustomPalette = (colors: string[]) =>
  COLOR_GRADES.reduce((acc, grade, i) => {
    acc[grade] = colors[i];

    return acc;
  }, {} as HSLShades);

export const DEFAULT_COLORS: { dark: IColor; light: IColor } = {
  dark: {
    hue: '197',
    palette: createCustomPalette(['#F2F7F7', '#828788', '#707577', '#5d6264', '#94999A', '#3b4042', '#33373a', '#4B5052', '#202428', '#161a1e']),
  },
  light: {
    hue: '211',
    palette: createCustomPalette(['#EFF1F3', '#E7ECF3', '#CFD6DC', '#C0C9D1', '#B0BBC5', '#A1ADBA', '#718497', '#62778C', '#718497', '#62778C']),
  },
};

export const BASE_COLORS: Colors = [
  {
    hue: '207',
    palette: createCustomPalette(['#e3eff8', '#d3e5f4', '#c3dcf0', '#a8cce9', '#81b5e0', '#5b9fd7', '#4e8bbd', '#3a6b93', '#284d6c', '#152f45']),
  },
  {
    hue: '130',
    palette: createCustomPalette(['#e0f0e3', '#cfe9d4', '#b2dcb9', '#9cd2a5', '#70bf7d', '#56b365', '#4a9b57', '#387642', '#27542e', '#17341c']),
  },
];

export const DEFAULT_THEMES: Colors = [
  ...BASE_COLORS,
  {
    hue: '331',
    palette: createCustomPalette(['#FEE7EC', '#FCD4DE', '#F8B9C8', '#F39BB0', '#E08097', '#CB627B', '#BD425F', '#9F324C', '#7B2338', '#561524']),
  },
  {
    hue: '9',
    palette: createCustomPalette(['#f8ebe8', '#f5e0dc', '#f0cdc7', '#ecbfb7', '#e4a398', '#dc8879', '#be7466', '#92564b', '#683a31', '#431f19']),
  },
];

export const ALL_COLORS = [DEFAULT_COLORS.dark, DEFAULT_COLORS.light, ...DEFAULT_THEMES];

export const BLOCK_STANDARD_COLOR = DEFAULT_COLORS.light.palette[STANDARD_GRADE];

export const LegacyBlockVariant: Record<string, string> = {
  purple: '#d7b0d7',
  standard: BLOCK_STANDARD_COLOR,
  red: ALL_COLORS[4].palette[STANDARD_GRADE],
  blue: ALL_COLORS[2].palette[STANDARD_GRADE],
  green: ALL_COLORS[3].palette[STANDARD_GRADE],
};

export const COLOR_WHEEL = `
radial-gradient(circle closest-side, white, black 90%),
conic-gradient(#ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
`;
