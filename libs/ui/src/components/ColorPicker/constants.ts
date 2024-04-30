import type { BaseModels } from '@voiceflow/base-types';

import type { HSLShades } from '@/utils/colors/hsl';
import { COLOR_GRADES } from '@/utils/colors/hsl';

export type { HSLShades };
export interface IColor extends BaseModels.Project.Theme {}

export type Colors = Array<IColor>;

export enum ColorScheme {
  DARK = 'dark',
  LIGHT = 'light',
  BLACK = 'black',
}

const createCustomPalette = (colors: string[]) =>
  COLOR_GRADES.reduce((acc, grade, i) => {
    acc[grade] = colors[i];

    return acc;
  }, {} as HSLShades);

export const DEFAULT_SCHEME_COLORS: Record<ColorScheme, IColor> = {
  [ColorScheme.DARK]: {
    standardColor: '#616769',
    palette: createCustomPalette([
      '#f2f7f7',
      '#e2e6e6',
      '#d1d6d7',
      '#c0c5c6',
      '#9fa5a8',
      '#616769',
      '#5B6063',
      '#4b5052',
      '#373A3C',
      '#2B2E2F',
    ]),
  },
  [ColorScheme.LIGHT]: {
    standardColor: '#A1ADBA',
    palette: createCustomPalette([
      '#EFF1F3',
      '#dde4ea',
      '#ced7e0',
      '#C0C9D1',
      '#B0BBC5',
      '#A1ADBA',
      '#718497',
      '#62778C',
      '#718497',
      '#62778C',
    ]),
  },
  [ColorScheme.BLACK]: {
    standardColor: '#43494E',
    palette: createCustomPalette([
      '#f2f7f7',
      '#e2e6e6',
      '#d1d6d7',
      '#c0c5c6',
      '#9fa5a8',
      '#43494E',
      '#353A3E',
      '#2b2f32',
      '#1F2224',
      '#0F1011',
    ]),
  },
};

export const BASE_COLORS: Colors = [
  {
    standardColor: '#5b9fd7',
    palette: createCustomPalette([
      '#e3eff8',
      '#d3e5f4',
      '#c3dcf0',
      '#a8cce9',
      '#81b5e0',
      '#5b9fd7',
      '#4e8bbd',
      '#3a6b93',
      '#284d6c',
      '#152f45',
    ]),
  },
  {
    standardColor: '#56b365',
    palette: createCustomPalette([
      '#e0f0e3',
      '#cfe9d4',
      '#b2dcb9',
      '#9cd2a5',
      '#70bf7d',
      '#56b365',
      '#4a9b57',
      '#387642',
      '#27542e',
      '#17341c',
    ]),
  },
];

export const DEFAULT_THEMES: Colors = [
  ...BASE_COLORS,
  {
    standardColor: '#CB627B',
    palette: createCustomPalette([
      '#FEE7EC',
      '#FCD4DE',
      '#F8B9C8',
      '#F39BB0',
      '#E08097',
      '#CB627B',
      '#BD425F',
      '#9F324C',
      '#7B2338',
      '#561524',
    ]),
  },
  {
    standardColor: '#dc8879',
    palette: createCustomPalette([
      '#f8ebe8',
      '#f5e0dc',
      '#f0cdc7',
      '#ecbfb7',
      '#e4a398',
      '#dc8879',
      '#be7466',
      '#92564b',
      '#683a31',
      '#431f19',
    ]),
  },
];

export const ALL_COLORS = [...Object.values(DEFAULT_SCHEME_COLORS), ...DEFAULT_THEMES];
export const ALL_COLORS_WITH_DARK_BASE = [DEFAULT_SCHEME_COLORS[ColorScheme.DARK], ...DEFAULT_THEMES];
export const ALL_COLORS_WITH_LIGHT_BASE = [DEFAULT_SCHEME_COLORS[ColorScheme.LIGHT], ...DEFAULT_THEMES];

export const CHIP_STANDARD_COLOR = DEFAULT_SCHEME_COLORS[ColorScheme.DARK].standardColor;
export const BLOCK_STANDARD_COLOR = DEFAULT_SCHEME_COLORS[ColorScheme.LIGHT].standardColor;

export const LegacyBlockVariant: Record<string, string> = {
  purple: '#d7b0d7',
  standard: BLOCK_STANDARD_COLOR,
  red: ALL_COLORS[5].standardColor,
  blue: ALL_COLORS[3].standardColor,
  green: ALL_COLORS[4].standardColor,
};

export const COLOR_WHEEL = `
radial-gradient(circle closest-side, white, black 90%),
conic-gradient(#ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
`;
