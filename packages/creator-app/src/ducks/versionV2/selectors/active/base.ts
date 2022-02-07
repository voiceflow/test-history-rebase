import { Version as GeneralVersion } from '@voiceflow/general-types';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getVersionByIDSelector } from '../base';

export const versionSelector = createSelector([Session.activeVersionIDSelector, getVersionByIDSelector], (versionID, getVersion) =>
  getVersion({ id: versionID })
);

export const creatorIDSelector = createSelector([versionSelector], (version) => version?.creatorID ?? null);

export const rootDiagramIDSelector = createSelector([versionSelector], (version) => version?.rootDiagramID ?? null);

export const globalVariablesSelector = createSelector([versionSelector], (version) => version?.variables ?? []);

export const sessionSelector = createSelector([versionSelector], (version) => version?.session ?? null);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const publishingSelector = createSelector([versionSelector], (version) => version?.publishing ?? null);

export const topicsSelector = createSelector([versionSelector], (version) => version?.topics ?? []);

export const componentsSelector = createSelector([versionSelector], (version) => version?.components ?? []);

export const foldersSelector = createSelector([versionSelector], (version) => version?.folders ?? {});

export const canvasNodeVisibilitySelector = createSelector([settingsSelector], (settings) => settings?.defaultCanvasNodeVisibility ?? null);

export const defaultVoiceSelector = createSelector(
  [settingsSelector],
  (settings) => (settings as GeneralVersion.GeneralVersionSettings)?.defaultVoice ?? null
);
