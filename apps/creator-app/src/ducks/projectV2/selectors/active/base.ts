import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { userIDSelector } from '@/ducks/account/selectors';
import * as Session from '@/ducks/session';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';

import { getAwarenessViewersByIDSelector } from '../awareness';
import { getProjectByIDSelector } from '../base';

export const projectSelector = createSelector([Session.activeProjectIDSelector, getProjectByIDSelector], (projectID, getProjectByID) =>
  getProjectByID({ id: projectID })
);

export const hasSelector = createSelector([projectSelector], (project) => !!project);
export const versionIDSelector = createSelector([projectSelector], (project) => project?.versionID);

export const awarenessViewersSelector = createSelector(
  [Session.activeProjectIDSelector, getAwarenessViewersByIDSelector],
  (projectID, getAwarenessViewersByID) => getAwarenessViewersByID({ id: projectID })
);

export const allAwarenessViewersSelector = createSelector([awarenessViewersSelector], (viewersPerDiagram) =>
  Object.values(viewersPerDiagram ?? {}).flatMap((viewers) => Normal.denormalize(viewers))
);

export const allAwarenessViewersCountSelector = createSelector([allAwarenessViewersSelector], (allViewers) => allViewers.length);

export const nluTypeSelector = createSelector([projectSelector], (project) => project?.nlu || Platform.Constants.NLUType.VOICEFLOW);

export const platformSelector = createSelector([projectSelector], (project) => project?.platform || Platform.Constants.PlatformType.VOICEFLOW);

export const projectTypeSelector = createSelector([projectSelector], (project) => project?.type || Platform.Constants.ProjectType.VOICE);

export const metaSelector = createSelector(
  [nluTypeSelector, projectTypeSelector, platformSelector],
  (nlu, type, platform): Realtime.ProjectMeta => ({ nlu, type, platform })
);

export const projectConfigSelector = createSelector([metaSelector], (meta) => Platform.Config.getTypeConfig(meta));

export const nameSelector = createSelector([projectSelector], (project) => project?.name ?? null);

export const idSelector = Session.activeProjectIDSelector;

export const linkTypeSelector = createSelector([projectSelector], (project) => project?.linkType || BaseModels.Project.LinkType.STRAIGHT);

export const aiAssistSettings = createSelector([projectSelector], (project) => project?.aiAssistSettings);

export const nluSettings = createSelector([projectSelector], (project) => project?.nluSettings);

/**
 * @deprecated use version.settings instead when INTENT_CLASSIFICATION feature is released
 */
export const isLLMClassifier = createSelector(
  [nluSettings],
  (nluSettings) => nluSettings?.classifyStrategy === BaseModels.Project.ClassifyStrategy.VF_NLU_LLM_HYBRID
);

export const customThemesSelector = createSelector([projectSelector], (project) => project?.customThemes || []);

export const isStraightLinksSelector = createSelector([linkTypeSelector], (linkType) => linkType === BaseModels.Project.LinkType.STRAIGHT);

export const isLiveSelector = createSelector([projectSelector], (project) => !!project?.isLive);

export const liveVersionSelector = createSelector([projectSelector], (project) => project?.liveVersion);

export const vfVersionSelector = createSelector([projectSelector], (project) => project?._version ?? Realtime.CURRENT_PROJECT_VERSION);

export const platformDataSelector = createSelector([projectSelector], (project) => project?.platformData ?? {});

export const updatedAtSelector = createSelector([projectSelector], (project) => project?.updatedAt);

export const membersSelector = createSelector([projectSelector], (project) => project?.members);

export const memberByIDSelector = createSelector([membersSelector, creatorIDParamSelector], (members, creatorID) =>
  members && creatorID !== null ? Normal.getOne(members, String(creatorID)) : null
);

export const getMemberByIDSelector = createCurriedSelector(memberByIDSelector);

export const userRoleSelector = createSelector([getMemberByIDSelector, userIDSelector], (getMember, creatorID) => {
  if (!creatorID) return null;
  return getMember({ creatorID })?.role ?? null;
});
