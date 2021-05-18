import { Locale as AlexaLocale } from '@voiceflow/alexa-types';
import { ProjectLinkType } from '@voiceflow/api-sdk';
import { createSelector } from 'reselect';

import * as Feature from '@/ducks/feature';
import { projectByIDSelector } from '@/ducks/project/selectors';
import { activeDiagramIDSelector, activeProjectIDSelector } from '@/ducks/session/selectors';
import { createRootSelector } from '@/ducks/utils';
import { getSlotTypes } from '@/utils/slot';

import { STATE_KEY } from './constants';

export const activeSkillSelector = createRootSelector(STATE_KEY);

export const activeNameSelector = createSelector(activeSkillSelector, ({ name }) => name);

export const rootDiagramIDSelector = createSelector(activeSkillSelector, ({ rootDiagramID }) => rootDiagramID);

export const activeGlobalVariablesSelector = createSelector(activeSkillSelector, (skill) => skill?.globalVariables || []);

export const activeProjectNameSelector = createSelector(
  [activeProjectIDSelector, projectByIDSelector],
  (projectID, getProjectByID) => getProjectByID(projectID!)?.name
);

export const activeProjectLinkTypeSelector = createSelector(
  [activeProjectIDSelector, projectByIDSelector],
  (projectID, getProjectByID) => getProjectByID(projectID!)?.linkType
);

export const activeProjectIsStraightLinksSelector = createSelector(
  [activeProjectLinkTypeSelector],
  (linkType) => linkType === ProjectLinkType.STRAIGHT
);

export const activeSkillCreatorIDSelector = createSelector(activeSkillSelector, ({ creatorID }) => creatorID);

export const activeLocalesSelector = createSelector(activeSkillSelector, ({ locales }) => locales);

export const activeSkillMetaSelector = createSelector(activeSkillSelector, ({ meta }) => meta);

export const parentCtrlSelector = createSelector(
  activeLocalesSelector,
  activeSkillMetaSelector,
  (locales, meta) => meta.copa && locales.includes(AlexaLocale.EN_US)
);

export const isRootDiagramSelector = createSelector(
  activeSkillSelector,
  activeDiagramIDSelector,
  ({ rootDiagramID }, activeDiagramID) => activeDiagramID === rootDiagramID
);

export const isCanvasExportingSelector = createSelector(activeSkillSelector, ({ canvasExporting }) => canvasExporting);

export const isModelExportingSelector = createSelector(activeSkillSelector, ({ modelExporting }) => modelExporting);

export const activeSlotTypesSelector = createSelector(
  [activeSkillSelector, Feature.isFeatureEnabledSelector],
  ({ locales, platform }, featureSelector) => getSlotTypes({ locales, platform }, featureSelector)
);
