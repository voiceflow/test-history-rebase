import { COLOR_GRADES, HSLShades } from '@ui/utils/colors/hsl';

export interface IColor {
  palette: HSLShades;
  editing?: boolean;
  name?: string;
  hue: string;
}

export type Colors = Array<IColor>;

const createCustomPalette = (colors: string[]) =>
  COLOR_GRADES.reduce((acc, grade, i) => {
    acc[String(grade)] = colors[i];

    return acc;
  }, {} as HSLShades);

export const DEFAULT_COLORS: { [key: string]: IColor } = {
  dark: {
    hue: '197',
    palette: createCustomPalette(['#F2F7F7', '#828788', '#707577', '#5d6264', '#94999A', '#3b4042', '#33373a', '#4B5052', '#202428', '#161a1e']),
  },
  light: {
    hue: '211',
    palette: createCustomPalette(['#EFF1F3', '#E8EBEE', '#CFD6DC', '#C0C9D1', '#B0BBC5', '#A1ADBA', '#919FAE', '#8192A3', '#718497', '#62778C']),
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
    palette: createCustomPalette(['#fce5f0', '#fbdaea', '#fac7df', '#f8acd0', '#f587bb', '#f263a7', '#d6528a', '#b63a65', '#922240', '#630b19']),
  },
  {
    hue: '9',
    palette: createCustomPalette(['#f8ebe8', '#f5e0dc', '#f0cdc7', '#ecbfb7', '#e4a398', '#dc8879', '#be7466', '#92564b', '#683a31', '#431f19']),
  },
];

export const ALL_COLORS = [DEFAULT_COLORS.dark, DEFAULT_COLORS.light, ...DEFAULT_THEMES];

export const COLOR_WHEEL = `
radial-gradient(circle closest-side, white, black 90%),
conic-gradient(#ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
`;
