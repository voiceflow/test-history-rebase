import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { STATE_KEY } from './constants';

export const prototypeSelector = createRootSelector(STATE_KEY);

export const prototypeNLCSelector = createSelector([prototypeSelector], ({ nlc }) => nlc);

export const prototypeStatusSelector = createSelector([prototypeSelector], ({ status }) => status);

export const prototypeContextSelector = createSelector([prototypeSelector], ({ context }) => context);

export const prototypeIDSelector = createSelector([prototypeSelector], ({ ID }) => ID);

export const prototypeTimeSelector = createSelector([prototypeSelector], ({ startTime }) => startTime);

export const prototypeVariablesSelector = createSelector([prototypeContextSelector], ({ variables = {} }) => variables);

export const prototypeMutedSelector = createSelector([prototypeSelector], ({ muted }) => muted);

export const prototypeInputModeSelector = createSelector([prototypeSelector], ({ inputMode }) => inputMode);

export const prototypeShowChipsSelector = createSelector([prototypeSelector], ({ showChips }) => showChips);

export const prototypeModeSelector = createSelector([prototypeSelector], ({ mode }) => mode);

export const prototypeDisplaySelector = createSelector([prototypeSelector], ({ display }) => display);
