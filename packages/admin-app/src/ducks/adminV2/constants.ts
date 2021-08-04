import { AdminState, ThemeType } from './types';

export const INITIAL_STATE: AdminState = {
  // The current creator being searched
  creator: {},
  betaCreator: {},
  boards: [],
  charges: [],
  vendors: [],
  error: {
    errorMessage: '',
    errorReturned: null,
  },
  dark: false,
  theme: ThemeType.LIGHT,
};

export const STATE_KEY = 'adminV2';
