import { ANIMATION_SPEED, COLOR_BLUE, COLOR_GREEN, COLOR_RED, COLOR_WHITE } from '@ui/styles/constants';

import ICON_THEME from './icon';

export enum ThemeColor {
  WHITE = 'white',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUARTERNARY = 'quaternary',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  DARK_BLUE = 'darkBlue',
  DARKER_BLUE = 'darkerBlue',
  BORDERS = 'borders',
  SEPARATOR = 'separator',
  SEPARATOR_SECONDARY = 'separatorSecondary',
}

const THEME = {
  unit: 8,
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  backgrounds: {
    offWhite: '#f9f9f9',
    offWhiteBlue: '#fafafc',
    white: '#ffffff',
    lightBlue: '#eff6fe',
    lightGray: '#fcfcfc',
    greyGreen: '#eef4f6',
    gray: '#f6f6f6',
  },
  iconColors: {
    disabled: '#becedc',
    active: '#6e849a',
  },
  buttonIconColors: {
    default: 'rgb(98 118 140 / 85%)',
    hover: 'rgb(98 118 140 / 100%)',
  },
  colors: {
    [ThemeColor.WHITE]: COLOR_WHITE,
    [ThemeColor.PRIMARY]: '#132144',
    [ThemeColor.SECONDARY]: '#62778c',
    [ThemeColor.TERTIARY]: '#8da2b5',
    [ThemeColor.QUARTERNARY]: '#949db0',
    [ThemeColor.RED]: COLOR_RED,
    [ThemeColor.GREEN]: COLOR_GREEN,
    [ThemeColor.BLUE]: COLOR_BLUE,
    [ThemeColor.DARK_BLUE]: '#4886da',
    [ThemeColor.DARKER_BLUE]: '#3D82E2',
    [ThemeColor.BORDERS]: '#dfe3ed',
    [ThemeColor.SEPARATOR]: '#dfe3ed',
    [ThemeColor.SEPARATOR_SECONDARY]: '#eaeff4',
  },
  space: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
  },
  fontSizes: {
    s: 13,
    m: 15,
    l: 28,
  },
  zIndex: {
    modal: 1010,
    popper: 1000,
    backdrop: 1005,
  },
  components: {
    button: {
      height: 42,
    },
    input: {
      height: 42,
    },
    menuItem: {
      height: 42,
    },
    audioPlayer: {
      height: 108,
    },
    imageUpload: {
      height: 230,
    },
    icon: ICON_THEME,

    sectionV2: {
      accentBackground: '#fdfdfd',
    },
  },
  transition(...propertyWhitelist: string[]): string {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
};

export type Theme = typeof THEME;

export default THEME;

export const createTheme = <T extends { components?: Record<string, any>; [key: string]: any }>(overrides: Omit<Partial<Theme>, 'components'> & T) =>
  ({
    ...THEME,
    ...overrides,

    components: {
      ...THEME.components,
      ...overrides.components,
    },
  } as Theme & T);
