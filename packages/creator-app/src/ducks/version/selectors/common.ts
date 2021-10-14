import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';
import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from '../constants';

export const { byID: versionByIDSelector } = createCRUDSelectors(STATE_KEY);

// active version

export const activeVersionSelector = createSelector([Session.activeVersionIDSelector, versionByIDSelector], (versionID, getVersionByID) =>
  versionID ? getVersionByID(versionID) : null
);

export const activeVersionCreatorIDSelector = createSelector([activeVersionSelector], (version) => version?.creatorID ?? null);

export const activeRootDiagramIDSelector = createSelector([activeVersionSelector], (version) => version?.rootDiagramID ?? null);

export const isRootDiagramActiveSelector = createSelector(
  [activeRootDiagramIDSelector, Session.activeDiagramIDSelector],
  (rootDiagramID, activeDiagramID) => !!rootDiagramID && !!activeDiagramID && rootDiagramID === activeDiagramID
);

export const activeGlobalVariablesSelector = createSelector([activeVersionSelector], (version) => version?.variables ?? []);

export const activeSessionSelector = createSelector([activeVersionSelector], (version) => version?.session ?? null);

export const activeSettingsSelector = createSelector([activeVersionSelector], (version) => version?.settings ?? null);

export const activePublishingSelector = createSelector([activeVersionSelector], (version) => version?.publishing ?? null);

export const activeTopicsSelector = createSelector([activeVersionSelector], (version) => version?.topics ?? []);

export const activeFoldersSelector = createSelector([activeVersionSelector], (version) => version?.folders ?? {});

export const activeComponentsSelector = createSelector([activeVersionSelector], (version) => version?.components ?? []);

export const activeCanvasNodeVisibilitySelector = createSelector(
  [activeSettingsSelector],
  (settings) => settings?.defaultCanvasNodeVisibility ?? null
);

// TODO: move to platform specific ?
export const activeDefaultVoiceSelector = createSelector([activeSettingsSelector], (settings) => settings?.defaultVoice ?? null);
