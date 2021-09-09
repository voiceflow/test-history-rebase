import { ProjectLinkType } from '@voiceflow/api-sdk';
import { PlatformType } from '@voiceflow/internal';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const {
  all: allProjectsSelector,
  map: projectsMapSelector,
  root: rootProjectsSelector,
  byID: projectByIDSelector,
  allIDs: allProjectsIDsSelector,
  getByID: getProjectByIDSelector,
} = createCRUDSelectors(STATE_KEY);

// project

export const projectPlatformByIDSelector = createSelector(projectByIDSelector, (project) => project?.platform || PlatformType.GENERAL);

export const projectNameByIDSelector = createSelector(projectByIDSelector, (project) => project?.name ?? null);

export const projectLinkTypeByIDSelector = createSelector(projectByIDSelector, (project) => project?.linkType || ProjectLinkType.STRAIGHT);

export const projectIsLiveByIDSelector = createSelector(projectByIDSelector, (project) => !!project?.isLive);

export const projectIsStraightLinksByIDSelector = createSelector(projectLinkTypeByIDSelector, (linkType) => linkType === ProjectLinkType.STRAIGHT);

export const projectsCountSelector = createSelector(allProjectsIDsSelector, (projectsIDs) => projectsIDs.length);
