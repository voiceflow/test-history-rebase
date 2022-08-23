import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';
import { createParameterSelector } from '@/ducks/utils';

import { getVersionByIDSelector } from '../base';

export const versionSelector = createSelector([Session.activeVersionIDSelector, getVersionByIDSelector], (versionID, getVersion) =>
  getVersion({ id: versionID })
);

export const creatorIDSelector = createSelector([versionSelector], (version) => version?.creatorID ?? null);

export const rootDiagramIDSelector = createSelector([versionSelector], (version) => version?.rootDiagramID ?? null);

export const templateDiagramIDSelector = createSelector([versionSelector], (version) => version?.templateDiagramID ?? null);

export const globalVariablesSelector = createSelector([versionSelector], (version) => version?.variables ?? []);

export const sessionSelector = createSelector([versionSelector], (version) => version?.session ?? null);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const publishingSelector = createSelector([versionSelector], (version) => version?.publishing ?? null);

export const topicsSelector = createSelector([versionSelector], (version) => version?.topics ?? []);

export const componentsSelector = createSelector([versionSelector], (version) => version?.components ?? []);

export const schemaVersionSelector = createSelector([versionSelector], (version) => version?._version ?? Realtime.SchemaVersion.V1);

export const foldersSelector = createSelector([versionSelector], (version) => version?.folders ?? {});

export const canvasNodeVisibilitySelector = createSelector([settingsSelector], (settings) => settings?.defaultCanvasNodeVisibility ?? null);

export const carouselLayoutSelector = createSelector([settingsSelector], (settings) => settings?.defaultCarouselLayout ?? null);

const stepTypeParamSelector = createParameterSelector(
  (params: { stepType: Realtime.BlockType }) => params.stepType as unknown as keyof Realtime.Version.DefaultStepColors
);

export const defaultStepColors = createSelector([versionSelector], (version) => version?.defaultStepColors ?? {});
export const defaultStepColorByStepType = createSelector(
  [defaultStepColors, stepTypeParamSelector],
  (defaultStepColors, stepType) => defaultStepColors[stepType]
);

export const defaultVoiceSelector = createSelector(
  [settingsSelector],
  (settings) => (settings as VoiceflowVersion.VoiceSettings)?.defaultVoice ?? null
);
