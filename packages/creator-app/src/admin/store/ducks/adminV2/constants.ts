/* eslint-disable import/prefer-default-export */
import { AdminState, THEMES } from './types';

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
  theme: THEMES.light,
};

export const STATE_KEY = 'adminV2';
