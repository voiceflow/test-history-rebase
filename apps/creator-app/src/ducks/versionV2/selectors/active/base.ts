import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { projectConfigSelector } from '@/ducks/projectV2/selectors/active';
import { createParameterSelector } from '@/ducks/utils';
import { isKey } from '@/utils/object';

import { platformSelectorsFactory } from './utils';

export const { versionSelector, sessionSelector, settingsSelector, publishingSelector } =
  platformSelectorsFactory<Platform.Base.Models.Version.Model>();

export const foldersSelector = createSelector([versionSelector], (version) => version?.folders ?? {});

export const localesSelector = createSelector([projectConfigSelector, publishingSelector, settingsSelector], (projectConfig, publishing, settings) =>
  projectConfig.project.locale.storedIn === 'publishing' ? publishing?.locales ?? [] : settings?.locales ?? []
);

export const creatorIDSelector = createSelector([versionSelector], (version) => version?.creatorID ?? null);

export const defaultStepColors = createSelector([versionSelector], (version) => version?.defaultStepColors ?? {});

export const componentsSelector = createSelector([versionSelector], (version) => version?.components ?? []);

/**
 *  Should be used only in the domain duck to get root domain
 */
export const rootDiagramIDSelector = createSelector([versionSelector], (version) => version?.rootDiagramID ?? null);

export const globalNoReplySelector = createSelector([settingsSelector], (settings) => settings?.globalNoReply ?? null);

export const globalNoMatchSelector = createSelector([settingsSelector], (settings) => settings?.globalNoMatch ?? null);

export const schemaVersionSelector = createSelector([versionSelector], (version) => version?._version ?? Realtime.SchemaVersion.V1);

export const invocationNameSelector = createSelector([publishingSelector], (publishing) => publishing?.invocationName ?? null);

export const carouselLayoutSelector = createSelector([settingsSelector], (settings) => settings?.defaultCarouselLayout ?? null);

export const globalVariablesSelector = createSelector([versionSelector], (version) => version?.variables ?? []);

export const templateDiagramIDSelector = createSelector([versionSelector], (version) => version?.templateDiagramID ?? null);

const stepTypeParamSelector = createParameterSelector((params: { stepType: Realtime.BlockType }) => params.stepType);

export const defaultStepColorByStepType = createSelector([defaultStepColors, stepTypeParamSelector], (defaultStepColors, stepType) =>
  isKey(defaultStepColors, stepType) ? defaultStepColors[stepType] : undefined
);

export const canvasNodeVisibilitySelector = createSelector([settingsSelector], (settings) => settings?.defaultCanvasNodeVisibility ?? null);

export const invocationNameSamplesSelector = createSelector([publishingSelector], (publishing) => publishing?.invocationNameSamples ?? []);

export const intentConfidenceSelector = createSelector([settingsSelector], (settings) => settings?.intentConfidence);
