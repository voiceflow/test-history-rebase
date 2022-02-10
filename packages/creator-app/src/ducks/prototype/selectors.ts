import { BaseButton } from '@voiceflow/base-types';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';
import { createRootSelector } from '@/ducks/utils';

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

export const prototypeShowButtonsSelector = createSelector([prototypeSelector], ({ showButtons }) => showButtons);

export const prototypeModeSelector = createSelector([prototypeSelector], ({ mode }) => mode);

export const activePrototypeModeSelector = createSelector(
  [Session.activeProjectIDSelector, prototypeModeSelector],
  (projectID, mode) => (projectID && mode[projectID]) || PrototypeMode.CANVAS
);

export const prototypeVisualSelector = createSelector([prototypeSelector], ({ visual }) => visual);

export const prototypeVisualDeviceSelector = createSelector([prototypeVisualSelector], ({ device }) => device);

export const prototypeVisualDataSelector = createSelector([prototypeVisualSelector], ({ data }) => data);

export const prototypeVisualDataHistorySelector = createSelector([prototypeVisualSelector], ({ dataHistory }) => dataHistory);

export const activePathBlockIDsSelector = createSelector([prototypeSelector], ({ activePathBlockIDs }) => activePathBlockIDs);

export const activePathLinkIDsSelector = createSelector([prototypeSelector], ({ activePathLinkIDs }) => activePathLinkIDs);

export const prototypeWebhookDataSelector = createSelector([prototypeSelector], ({ webhook }) => webhook);

export const prototypeSettingsSelector = createSelector([prototypeSelector], ({ settings }) => settings);

export const prototypeButtonsSelector = createSelector([prototypeSelector], ({ settings }) => settings.buttons as BaseButton.ButtonsLayout);

export const prototypeLayoutSelector = createSelector([prototypeSelector], ({ settings }) => settings.layout || PrototypeLayout.TEXT_DIALOG);

export const prototypeBrandColorSelector = createSelector([prototypeSelector], ({ settings }) => settings.brandColor || '#3D81E2');

export const prototypeBrandImageSelector = createSelector([prototypeSelector], ({ settings }) => settings.brandImage || '');

export const prototypeAvatarSelector = createSelector([prototypeSelector], ({ settings }) => settings.avatar || '');

export const prototypeBrandInfoSelector = createSelector([prototypeSelector], ({ settings: { layout: _, ...brandSettings } }) => brandSettings);

export const prototypePasswordSelector = createSelector([prototypeSelector], ({ settings }) => settings.password || '');
