import { Locale as AlexaLocale } from '@voiceflow/alexa-types';
import { createSelector } from 'reselect';

import { projectByIDSelector } from '@/ducks/project/selectors';
import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

export const activeSkillSelector = createRootSelector(STATE_KEY);

export const activeSkillIDSelector = createSelector(activeSkillSelector, ({ id }) => id);

export const activeNameSelector = createSelector(activeSkillSelector, ({ name }) => name);

export const activePlatformSelector = createSelector(activeSkillSelector, ({ platform }) => platform);

export const activeDiagramIDSelector = createSelector(activeSkillSelector, ({ diagramID }) => diagramID);

export const rootDiagramIDSelector = createSelector(activeSkillSelector, ({ rootDiagramID }) => rootDiagramID);

export const globalVariablesSelector = createSelector(activeSkillSelector, (skill) => skill?.globalVariables || []);

export const activeProjectIDSelector = createSelector(activeSkillSelector, ({ projectID }) => projectID);

export const activeProjectNameSelector = createSelector(
  [activeProjectIDSelector, projectByIDSelector],
  (projectID, getProjectByID) => getProjectByID(projectID)?.name
);

export const activeSkillCreatorIDSelector = createSelector(activeSkillSelector, ({ creatorID }) => creatorID);

export const activeLocalesSelector = createSelector(activeSkillSelector, ({ locales }) => locales);

export const activeSkillMetaSelector = createSelector(activeSkillSelector, ({ meta }) => meta);

export const parentCtrlSelector = createSelector(
  activeLocalesSelector,
  activeSkillMetaSelector,
  (locales, meta) => meta.copa && locales.includes(AlexaLocale.EN_US)
);

export const isRootDiagramSelector = createSelector(activeSkillSelector, ({ diagramID, rootDiagramID }) => diagramID === rootDiagramID);

export const isCanvasExportingSelector = createSelector(activeSkillSelector, ({ canvasExporting }) => canvasExporting);
