import dayjs from 'dayjs';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import { isEditorUserRole } from '@/utils/role';

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
  const editorRoleProjectsByUserID: Record<number, string[]> = {};

  projects.forEach((project) => {
    Object.values(project.members.byKey).forEach((member) => {
      if (!isEditorUserRole(member.role)) return;

      editorRoleProjectsByUserID[member.creatorID] ??= [];
      editorRoleProjectsByUserID[member.creatorID].push(project.name);
    });
  });
  return editorRoleProjectsByUserID;
});

export const projectsSortedByUpdatedAtSelector = createSelector([allProjectsSelector], (projects) =>
  projects.sort((a, b) => {
    if (a.updatedAt && !b.updatedAt) return -1;
    if (b.updatedAt && !a.updatedAt) return 1;

    return dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1;
  })
);

export const allEditorMemberIDs = createSelector([allProjectsSelector], (projects) => {
  const editorUserIDs = new Set<number>();

  projects.forEach((project) => {
    Object.values(project.members.byKey).forEach((member) => {
      if (!isEditorUserRole(member.role)) return;

      editorUserIDs.add(member.creatorID);
    });
  });

  return Array.from(editorUserIDs);
});
