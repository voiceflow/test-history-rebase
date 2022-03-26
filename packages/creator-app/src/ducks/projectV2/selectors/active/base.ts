import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getProjectByIDSelector } from '../base';

export const projectSelector = createSelector([Session.activeProjectIDSelector, getProjectByIDSelector], (projectID, getProjectByID) =>
  getProjectByID({ id: projectID })
);

/**
 * @deprecated
 */
export const platformSelector = createSelector([projectSelector], (project) => project?.platform || VoiceflowConstants.PlatformType.VOICEFLOW);

export const typeV2Selector = createSelector([projectSelector], (project) => project?.typeV2 || VoiceflowConstants.ProjectType.VOICE);

export const platformV2Selector = createSelector([projectSelector], (project) => project?.platformV2 || VoiceflowConstants.PlatformType.VOICEFLOW);

export const metaSelector = createSelector([typeV2Selector, platformV2Selector], (type, platform) => ({ type, platform }));

export const nameSelector = createSelector([projectSelector], (project) => project?.name ?? null);

export const linkTypeSelector = createSelector([projectSelector], (project) => project?.linkType || BaseModels.Project.LinkType.STRAIGHT);

export const isStraightLinksSelector = createSelector([linkTypeSelector], (linkType) => linkType === BaseModels.Project.LinkType.STRAIGHT);

export const isLiveSelector = createSelector([projectSelector], (project) => !!project?.isLive);

export const vfVersionSelector = createSelector([projectSelector], (project) => project?._version ?? Realtime.CURRENT_PROJECT_VERSION);

export const isTopicsAndComponentsVersionSelector = createSelector(
  [vfVersionSelector],
  (vfVersion) => vfVersion >= Realtime.TOPICS_AND_COMPONENTS_PROJECT_VERSION
);
