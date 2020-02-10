import { createSelector } from 'reselect';

import * as Creator from '@/ducks/creator';
import { createRootSelector } from '@/ducks/utils';
import * as Workspace from '@/ducks/workspace';

import { LockType, STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const realtimeDiagramIDSelector = createSelector(rootSelector, ({ diagramID }) => diagramID);

export const realtimeLocksSelector = createSelector(rootSelector, ({ locks }) => locks);

export const isRealtimeConnectedSelector = createSelector(rootSelector, ({ connected }) => connected);

export const isErrorStateSelector = createSelector(rootSelector, ({ errorState }) => errorState);

export const lastRealtimeTimestampSelector = createSelector(rootSelector, ({ lastTimestamp }) => lastTimestamp);

export const isNodeLockedSelector = createSelector(realtimeLocksSelector, ({ blocks }) => (lockType, nodeID) => !!blocks[lockType][nodeID]);

export const isNodeMovementLockedSelector = createSelector(isNodeLockedSelector, (isNodeLocked) => (nodeID) =>
  isNodeLocked(LockType.MOVEMENT, nodeID)
);

export const isNodeEditLockedSelector = createSelector(isNodeLockedSelector, (isNodeLocked) => (nodeID) => isNodeLocked(LockType.EDIT, nodeID));

export const deletionLockedNodesSelector = createSelector(realtimeLocksSelector, ({ blocks }) => ({
  ...blocks[LockType.MOVEMENT],
  ...blocks[LockType.EDIT],
}));

export const lockOwnerTabIDSelector = createSelector(realtimeLocksSelector, ({ blocks }) => (lockType, nodeID) => blocks[lockType][nodeID]);

export const reourceLockOwnerTabIDSelector = createSelector(realtimeLocksSelector, ({ resources }) => (resourceType) => resources[resourceType]);

export const isSessionBusy = createSelector(rootSelector, ({ sessionBusy }) => sessionBusy);

/**
 * get the tabID by the creatorID
 */
export const creatorMappingSelector = createSelector(
  realtimeLocksSelector,
  lockOwnerTabIDSelector,
  ({ users }, getTabID) => (lockType, nodeID, diagramID) => {
    const tabID = getTabID(lockType, nodeID);

    return [tabID, users[diagramID]?.[tabID]];
  }
);

/**
 * get the team member who has the node locked
 */
export const lockOwnerSelector = createSelector(
  Creator.creatorDiagramIDSelector,
  creatorMappingSelector,
  Workspace.distinctWorkspaceMemberSelector,
  (diagramID, getCreatorMapping, getWorkspaceMember) => (lockType, nodeID) => {
    const [tabID, creatorID] = getCreatorMapping(lockType, nodeID, diagramID);
    return getWorkspaceMember(creatorID, tabID);
  }
);

/**
 * get the team member who has the node edit locked
 */
export const editLockOwnerSelector = createSelector(lockOwnerSelector, (getLockOwner) => (nodeID) => getLockOwner(LockType.EDIT, nodeID));

/**
 * get the team member who has the resource locked
 */
export const resourceLockOwnerSelector = createSelector(
  realtimeLocksSelector,
  reourceLockOwnerTabIDSelector,
  Workspace.distinctWorkspaceMemberSelector,
  ({ users }, getTabID, getWorkspaceMember) => (resourceType) => {
    const tabID = getTabID(resourceType);
    const found = Object.values(users)
      .flatMap(Object.entries)
      .find(([key]) => key === tabID);

    if (found) {
      const [, creatorID] = found;
      return getWorkspaceMember(creatorID, tabID);
    }

    return null;
  }
);

export const isResourceLockedSelector = createSelector(realtimeLocksSelector, (locks) => (resourceID) => !!locks.resources[resourceID]);
