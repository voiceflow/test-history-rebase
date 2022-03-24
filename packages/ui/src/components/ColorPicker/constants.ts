import { HSLShades } from '@ui/utils/colors/hsl';

export interface IColor {
  palette: HSLShades;
  editing?: boolean;
  name?: string;
  hue: string;
}

export type Colors = Array<IColor>;

export const BASE_COLORS: Colors = [
  {
    hue: '197',
    editing: true,
    palette: {
      '50': '#eceeee',
      '100': '#e0e3e3',
      '200': '#d1d5d5',
      '300': '#c4c7c7',
      '400': '#aeb1b1',
      '500': '#707577',
      '600': '#828484',
      '700': '#676868',
      '800': '#4a4c4c',
      '900': '#2d2e2e',
    },
  },
  {
    hue: '207',
    palette: {
      '50': '#d7f3f8',
      '100': '#baebf4',
      '200': '#8ee1ef',
      '300': '#84d3e0',
      '400': '#75bcc7',
      '500': '#5b9fd7',
      '600': '#568c95',
      '700': '#436f76',
      '800': '#2f5056',
      '900': '#1b3235',
    },
  },
  {
    hue: '130',
    palette: {
      '50': '#daf5dc',
      '100': '#beefc1',
      '200': '#a6e3ab',
      '300': '#9bd49f',
      '400': '#8abd8e',
      '500': '#56b365',
      '600': '#668d69',
      '700': '#507052',
      '800': '#39513b',
      '900': '#223223',
    },
  },
];
export const DEFAULT_COLORS: Colors = [
  ...BASE_COLORS,
  {
    hue: '331',
    palette: {
      '50': '#fce8f3',
      '100': '#fbd9ec',
      '200': '#f9c6e3',
      '300': '#f7b2db',
      '400': '#f590ce',
      '500': '#f263a7',
      '600': '#e639b2',
      '700': '#b82b8d',
      '800': '#881d68',
      '900': '#570f41',
    },
  },
  {
    hue: '9',
    name: 'Error Path',
    palette: {
      '50': '#f8ebeb',
      '100': '#f4ddde',
      '200': '#efccce',
      '300': '#eabbbd',
      '400': '#e49ea2',
      '500': '#dc8879',
      '600': '#d95963',
      '700': '#b2424b',
      '800': '#832e35',
      '900': '#541b1f',
    },
  },
];
export const COLOR_WHEEL = `
  radial-gradient(circle closest-side, white, black 90%),
  conic-gradient(#ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
`;
