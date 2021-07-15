import { getAlternativeColor } from '@voiceflow/ui';
import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { PROJECT_STATE_KEY } from './constants';

const rootSelector = createRootSelector(PROJECT_STATE_KEY);

export const projectStateSelector = createSelector(
  [rootSelector],
  (state) => (projectID: string) => Object.prototype.hasOwnProperty.call(state, projectID) ? state[projectID] : null
);

export const projectAwarenessSelector = createSelector([projectStateSelector], (getProjectState) => (projectID: string) => {
  const projectState = getProjectState(projectID);

  return projectState ? projectState.awareness : {};
});

export const projectViewersTabIDsSelector = createSelector([projectAwarenessSelector], (getProjectAwareness) => (projectID: string) => {
  const awareness = getProjectAwareness(projectID);

  return Object.keys(awareness);
});

export const hasExternalProjectViewersSelector = createSelector(
  [projectViewersTabIDsSelector],
  (getViewersTabIDs) => (projectID: string) => getViewersTabIDs(projectID).length > 1
);

export const projectViewersSelector = createSelector([projectAwarenessSelector], (getProjectAwareness) => (projectID: string) => {
  const awareness = getProjectAwareness(projectID);

  if (!awareness) return [];

  return Object.entries(awareness).map(([tabID, viewer]) => ({
    tabID,
    creator_id: viewer.creatorID,
    name: viewer.name,
    image: viewer.image,
    color: getAlternativeColor(tabID),
  }));
});

export const projectHasViewerSelector = createSelector([projectAwarenessSelector], (getProjectAwareness) => (projectID: string, tabID: string) => {
  const awareness = getProjectAwareness(projectID);

  if (!awareness) return false;

  return Object.keys(awareness).includes(tabID);
});

export const projectViewerSelector = createSelector([projectAwarenessSelector], (getProjectAwareness) => (projectID: string, tabID: string) => {
  const awareness = getProjectAwareness(projectID);

  return (
    {
      ...awareness[tabID],
      color: getAlternativeColor(tabID),
    } ?? null
  );
});
