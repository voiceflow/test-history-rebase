import { Models as BaseModels } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getProjectByIDSelector } from '../base';

export const projectSelector = createSelector([Session.activeProjectIDSelector, getProjectByIDSelector], (projectID, getProjectByID) =>
  projectID ? getProjectByID(projectID) : null
);

export const platformSelector = createSelector([projectSelector], (project) => project?.platform || Constants.PlatformType.GENERAL);

export const nameSelector = createSelector([projectSelector], (project) => project?.name ?? null);

export const linkTypeSelector = createSelector([projectSelector], (project) => project?.linkType || BaseModels.ProjectLinkType.STRAIGHT);

export const isStraightLinksSelector = createSelector([linkTypeSelector], (linkType) => linkType === BaseModels.ProjectLinkType.STRAIGHT);

export const isLiveSelector = createSelector([projectSelector], (project) => !!project?.isLive);

export const vfVersionSelector = createSelector([projectSelector], (project) => project?._version ?? Realtime.CURRENT_PROJECT_VERSION);

export const isTopicsAndComponentsVersionSelector = createSelector(
  [vfVersionSelector],
  (vfVersion) => vfVersion >= Realtime.TOPICS_AND_COMPONENTS_PROJECT_VERSION
);
