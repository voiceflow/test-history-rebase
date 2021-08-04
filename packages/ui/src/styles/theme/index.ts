import { ANIMATION_SPEED, COLOR_BLUE, COLOR_GREEN, COLOR_RED, COLOR_WHITE } from '../constants';
import ICON_THEME from './icon';

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
  colors: {
    white: COLOR_WHITE,
    primary: '#132144',
    secondary: '#62778c',
    tertiary: '#8da2b5',
    quaternary: '#949db0',
    red: COLOR_RED,
    green: COLOR_GREEN,
    blue: COLOR_BLUE,
    darkBlue: '#4886da',
    borders: '#dfe3ed',
    separator: '#dfe3ed',
    separatorSecondary: '#eaeff4',
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
    icon: ICON_THEME,
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
