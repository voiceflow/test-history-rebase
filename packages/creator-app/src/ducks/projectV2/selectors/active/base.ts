import { ProjectLinkType } from '@voiceflow/api-sdk';
import { Constants } from '@voiceflow/general-types';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getProjectByIDSelector } from '../base';

export const projectSelector = createSelector([Session.activeProjectIDSelector, getProjectByIDSelector], (projectID, getProjectByID) =>
  projectID ? getProjectByID(projectID) : null
);

export const platformSelector = createSelector([projectSelector], (project) => project?.platform || Constants.PlatformType.GENERAL);

export const nameSelector = createSelector([projectSelector], (project) => project?.name ?? null);

export const linkTypeSelector = createSelector([projectSelector], (project) => project?.linkType || ProjectLinkType.STRAIGHT);

export const isStraightLinksSelector = createSelector([linkTypeSelector], (linkType) => linkType === ProjectLinkType.STRAIGHT);

export const isLiveSelector = createSelector([projectSelector], (project) => !!project?.isLive);
