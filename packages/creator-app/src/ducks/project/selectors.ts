import { ProjectLinkType } from '@voiceflow/api-sdk';
import { createSelector } from 'reselect';

import { PlatformType } from '@/constants';
import * as Session from '@/ducks/session';
import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export const {
  root: rootProjectsSelector,
  all: allProjectsSelector,
  map: projectsMapSelector,
  byID: projectByIDSelector,
  has: hasProjectsSelector,
} = createCRUDSelectors(STATE_KEY);

// active project

export const activeProjectSelector = createSelector([Session.activeProjectIDSelector, projectByIDSelector], (projectID, getProjectByID) =>
  projectID ? getProjectByID(projectID) : null
);

export const activePlatformSelector = createSelector([activeProjectSelector], (project) => project?.platform || PlatformType.GENERAL);

export const activeProjectNameSelector = createSelector([activeProjectSelector], (project) => project?.name ?? null);

export const activeProjectLinkTypeSelector = createSelector([activeProjectSelector], (project) => project?.linkType || ProjectLinkType.STRAIGHT);

export const isActiveProjectLiveSelector = createSelector([activeProjectSelector], (project) => !!project?.isLive);

export const isStraightLinksSelector = createSelector([activeProjectLinkTypeSelector], (linkType) => linkType === ProjectLinkType.STRAIGHT);

export const projectsCountSelector = createSelector([allProjectsSelector], (projects) => projects.length);
