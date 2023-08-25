import { BaseButton } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as ProjectV2 from '@/ducks/projectV2';
import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

export const prototypeSelector = createRootSelector(STATE_KEY);

export const prototypeStatusSelector = createSelector([prototypeSelector], ({ status }) => status);

export const prototypeAutoplaySelector = createSelector([prototypeSelector], ({ autoplay }) => autoplay);

export const prototypeContextSelector = createSelector([prototypeSelector], ({ context }) => context);

export const prototypeContextHistorySelector = createSelector([prototypeSelector], ({ contextHistory }) => contextHistory);

export const prototypeFlowIDHistorySelector = createSelector([prototypeSelector], ({ flowIDHistory }) => flowIDHistory);

export const prototypeContextStepSelector = createSelector([prototypeSelector], ({ contextStep }) => contextStep);

export const prototypeSessionIDSelector = createSelector([prototypeSelector], ({ sessionID }) => sessionID);

export const prototypeTimeSelector = createSelector([prototypeSelector], ({ startTime }) => startTime);

export const prototypeVariablesSelector = createSelector([prototypeContextSelector], ({ variables = {} }) => variables);

export const prototypeMutedSelector = createSelector([prototypeSelector], ({ muted }) => muted);

export const prototypeInputModeSelector = createSelector([prototypeSelector], ({ inputMode }) => inputMode);

export const prototypeShowButtonsSelector = createSelector([prototypeSelector], ({ showButtons }) => showButtons);

export const prototypeVisualSelector = createSelector([prototypeSelector], ({ visual }) => visual);

export const prototypeVisualDeviceSelector = createSelector([prototypeVisualSelector], ({ device }) => device);

export const prototypeVisualDataSelector = createSelector([prototypeVisualSelector], ({ data }) => data);

export const prototypeVisualDataHistorySelector = createSelector([prototypeVisualSelector], ({ dataHistory }) => dataHistory);

export const activePathsSelector = createSelector([prototypeSelector], ({ activePaths }) => activePaths);

export const activePathByDiagramIDSelector = createSelector(
  [activePathsSelector],
  (activePaths) => (diagramID: string) => activePaths[diagramID] ?? { linkIDs: [], blockIDs: [] }
);

export const prototypeSettingsSelector = createSelector([prototypeSelector], ({ settings }) => settings);

export const prototypeButtonsSelector = createSelector([prototypeSelector], ({ settings }) => settings.buttons as BaseButton.ButtonsLayout);

export const prototypeLayoutSelector = createSelector(
  [prototypeSelector, ProjectV2.active.projectTypeSelector],
  ({ settings }, projectType) => settings.layout || Realtime.Utils.platform.getDefaultPrototypeLayout(projectType)
);

export const prototypeBrandColorSelector = createSelector([prototypeSelector], ({ settings }) => settings.brandColor || '#3D81E2');

export const prototypeBrandImageSelector = createSelector([prototypeSelector], ({ settings }) => settings.brandImage || '');

export const prototypeAvatarSelector = createSelector([prototypeSelector], ({ settings }) => settings.avatar || '');

export const prototypeBrandInfoSelector = createSelector([prototypeSelector], ({ settings: { layout: _, ...brandSettings } }) => brandSettings);

export const prototypePasswordSelector = createSelector([prototypeSelector], ({ settings }) => settings.password || '');

export const prototypeButtonsOnlySelector = createSelector([prototypeSelector], ({ settings }) => !!settings.buttonsOnly);

export const prototypeSelectedPersonaID = createSelector([prototypeSelector], ({ selectedPersonaID }) => selectedPersonaID);
