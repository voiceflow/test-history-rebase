import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { STATE_KEY } from './constants';

export const prototypeSelector = createRootSelector(STATE_KEY);

export const prototypeStatusSelector = createSelector([prototypeSelector], ({ status }) => status);

export const prototypeAutoplaySelector = createSelector([prototypeSelector], ({ autoplay }) => autoplay);

export const prototypeContextSelector = createSelector([prototypeSelector], ({ context }) => context);

export const prototypeContextHistorySelector = createSelector([prototypeSelector], ({ contextHistory }) => contextHistory);

export const prototypeFlowIDHistorySelector = createSelector([prototypeSelector], ({ flowIDHistory }) => flowIDHistory);

export const prototypeContextStepSelector = createSelector([prototypeSelector], ({ contextStep }) => contextStep);

export const prototypeIDSelector = createSelector([prototypeSelector], ({ ID }) => ID);

export const prototypeTimeSelector = createSelector([prototypeSelector], ({ startTime }) => startTime);

export const prototypeVariablesSelector = createSelector([prototypeContextSelector], ({ variables = {} }) => variables);

export const prototypeMutedSelector = createSelector([prototypeSelector], ({ muted }) => muted);

export const prototypeInputModeSelector = createSelector([prototypeSelector], ({ inputMode }) => inputMode);

export const prototypeShowChipsSelector = createSelector([prototypeSelector], ({ showChips }) => showChips);

export const prototypeModeSelector = createSelector([prototypeSelector], ({ mode }) => mode);

export const prototypeVisualSelector = createSelector([prototypeSelector], ({ visual }) => visual);

export const prototypeVisualDeviceSelector = createSelector([prototypeVisualSelector], ({ device }) => device);

export const prototypeVisualSourceIDSelector = createSelector([prototypeVisualSelector], ({ sourceID }) => sourceID);

export const activePathBlockIDsSelector = createSelector([prototypeSelector], ({ activePathBlockIDs }) => activePathBlockIDs);

export const activePathLinkIDsSelector = createSelector([prototypeSelector], ({ activePathLinkIDs }) => activePathLinkIDs);

export const prototypeWebhookDataSelector = createSelector([prototypeSelector], ({ webhook }) => webhook);
