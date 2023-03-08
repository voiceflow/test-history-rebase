import { UserRole } from '@voiceflow/internal';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const {
  map: projectsMapSelector,
  all: allProjectsSelector,
  byID: projectByIDSelector,
  root: rootProjectsSelector,
  count: projectsCountSelector,
  getByID: getProjectByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const membersByProjectIDSelector = createSelector([projectByIDSelector], (project) => project?.members);

export const editorRoleProjectsByUserIDSelector = createSelector([allProjectsSelector], (projects) => {
  const editorRoleProjectsByUserID: Record<string, string[]> = {};

  projects.forEach((project) => {
    Object.values(project.members.byKey).forEach((member) => {
      if (member.role !== UserRole.EDITOR) return;

      editorRoleProjectsByUserID[member.creatorID] ??= [];
      editorRoleProjectsByUserID[member.creatorID].push(project.name);
    });
  });
  return editorRoleProjectsByUserID;
});
