import { THEMES } from '@/admin/store/ducks/admin';

export const mainTheme = {
  palette: {
    common: {
      black: '#132144',
      white: '#fff',
    },
    type: 'light',
    primary: {
      light: '#EDF2FF',
      main: '#5d9df5',
      dark: '#326fc3',
      contrastText: '#fff',
    },
    secondary: {
      light: '#EEF3F6',
      main: '#DEE9ED',
      dark: '#8C94A6',
      contrastText: '#132144',
    },
    error: {
      light: '#FEEEF1',
      main: '#e91e63',
      dark: '#b5003d',
      contrastText: '#fff',
    },
    grey: {
      light: '#8da2b5',
      faint: '#d4d9e6',
    },
    text: {
      primary: '#132144',
      secondary: '#8C94A6',
      disabled: '',
      hint: '',
    },
    divider: {
      light: '#d4d9e6',
      strong: '#8C94A6',
    },
    background: {
      default: '#f9f9f9',
      highlight: '#fff',
    },
    link: {
      active: '',
      hover: '',
      selected: '',
      disabled: '',
    },
  },

  shadows: ['none'],
};

export const darkTheme = {
  palette: {
    common: {
      black: '#132144',
      white: '#fff',
    },
    type: 'light',
    primary: {
      light: '#EDF2FF',
      main: '#5d9df5',
      dark: '#5d9df5',
      contrastText: '#fff',
    },
    secondary: {
      light: '#EEF3F6',
      main: '#DEE9ED',
      dark: '#8C94A6',
      contrastText: '#132144',
    },
    error: {
      light: '#FEEEF1',
      main: '#e91e63',
      dark: '#b5003d',
      contrastText: '#fff',
    },
    grey: {
      light: '#8da2b5',
      faint: '#d4d9e6',
    },
    text: {
      primary: '#fff',
      secondary: '#8C94A6',
      disabled: '',
      hint: '',
    },
    divider: {
      light: '#d4d9e6',
      strong: '#8C94A6',
    },
    background: {
      default: '#000',
      highlight: '#15181B',
    },
    link: {
      active: '',
      hover: '',
      selected: '',
      disabled: '',
    },
  },

  shadows: ['none'],
};

export const mappedThemes = {
  [THEMES.light]: mainTheme,
  [THEMES.dark]: darkTheme,
};
