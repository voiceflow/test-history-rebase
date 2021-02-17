import { createSelector } from 'reselect';

import * as Skill from '../skill';
import { createRootSelector } from '../utils';
import { STATE_KEY } from './constants';
import { PrototypeLayout, PrototypeMode } from './types';

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

export const activePrototypeModeSelector = createSelector(
  [Skill.activeProjectIDSelector, prototypeModeSelector],
  (projectID, mode) => mode[projectID] || PrototypeMode.CANVAS
);

export const prototypeVisualSelector = createSelector([prototypeSelector], ({ visual }) => visual);

export const prototypeVisualDeviceSelector = createSelector([prototypeVisualSelector], ({ device }) => device);

export const prototypeVisualDataSelector = createSelector([prototypeVisualSelector], ({ data }) => data);

export const prototypeVisualDataHistorySelector = createSelector([prototypeVisualSelector], ({ dataHistory }) => dataHistory);

export const activePathBlockIDsSelector = createSelector([prototypeSelector], ({ activePathBlockIDs }) => activePathBlockIDs);

export const activePathLinkIDsSelector = createSelector([prototypeSelector], ({ activePathLinkIDs }) => activePathLinkIDs);

export const prototypeWebhookDataSelector = createSelector([prototypeSelector], ({ webhook }) => webhook);

export const prototypeLayoutSelector = createSelector([prototypeSelector], ({ settings }) => settings.layout || PrototypeLayout.TEXT_DIALOG);
