import { createSelector } from 'reselect';

import * as Creator from '@/ducks/creator';
import { createRootSelector } from '@/ducks/utils';
import * as Workspace from '@/ducks/workspace';
import { getAlternativeColor } from '@/utils/colors';

import { LockType, ResourceType, STATE_KEY } from './constants';
import { AnyNodeLock } from './types';

const rootSelector = createRootSelector(STATE_KEY);

export const realtimeDiagramIDSelector = createSelector([rootSelector], ({ diagramID }) => diagramID);

export const realtimeLocksSelector = createSelector([rootSelector], ({ locks }) => locks);

export const isRealtimeConnectedSelector = createSelector([rootSelector], ({ connected }) => connected);

export const isErrorStateSelector = createSelector([rootSelector], ({ errorState }) => errorState);

export const lastRealtimeTimestampSelector = createSelector([rootSelector], ({ lastTimestamp }) => lastTimestamp);

export const rtctimestampSelector = createSelector(lastRealtimeTimestampSelector, (rtctimestamp) => rtctimestamp?.toString() || '');

export const isNodeLockedSelector = createSelector([realtimeLocksSelector], (locks) => (lockType: AnyNodeLock, nodeID: string) =>
  !!locks?.blocks[lockType]?.[nodeID]
);

export const isTabRegisteredSelector = createSelector([realtimeLocksSelector], (locks) => (tabID: string) =>
  Object.values(locks?.users ?? {})
    .flatMap(Object.keys)
    .some((id) => id === tabID)
);

export const isNodeMovementLockedSelector = createSelector([isNodeLockedSelector], (isNodeLocked) => (nodeID: string) =>
  isNodeLocked(LockType.MOVEMENT, nodeID)
);

export const isNodeEditLockedSelector = createSelector([isNodeLockedSelector], (isNodeLocked) => (nodeID: string) =>
  isNodeLocked(LockType.EDIT, nodeID)
);

export const deletionLockedNodesSelector = createSelector(
  [realtimeLocksSelector],
  (locks): Record<string, string> => ({
    ...locks?.blocks[LockType.MOVEMENT],
    ...locks?.blocks[LockType.EDIT],
  })
);

export const lockOwnerTabIDSelector = createSelector([realtimeLocksSelector], (locks) => (lockType: AnyNodeLock, nodeID: string) =>
  locks?.blocks[lockType]?.[nodeID]
);

export const resourceLockOwnerTabIDSelector = createSelector([realtimeLocksSelector], (locks) => (resourceType: ResourceType) =>
  locks?.resources[resourceType]
);

export const isSessionBusy = createSelector([rootSelector], ({ sessionBusy }) => sessionBusy);

export const isRestrictedSelector = createSelector([rootSelector], ({ restricted }) => restricted);

/**
 * get the tabID by the creatorID
 */
export const creatorMappingSelector = createSelector(
  [realtimeLocksSelector, lockOwnerTabIDSelector],
  (locks, getTabID) => (lockType: AnyNodeLock, nodeID: string, diagramID: string): [string, string?] => {
    const tabID = getTabID(lockType, nodeID)!;

    return [tabID, locks?.users[diagramID]?.[tabID]];
  }
);

/**
 * get the team member who has the node locked
 */
export const lockOwnerSelector = createSelector(
  [Creator.creatorDiagramIDSelector, creatorMappingSelector, Workspace.distinctWorkspaceMemberSelector],
  (diagramID, getCreatorMapping, getWorkspaceMember) => (lockType: AnyNodeLock, nodeID: string) => {
    const [tabID, creatorID] = getCreatorMapping(lockType, nodeID, diagramID!);
    return creatorID ? getWorkspaceMember(creatorID, tabID) : null;
  }
);

/**
 * get the team member who has the node edit locked
 */
export const editLockOwnerSelector = createSelector([lockOwnerSelector], (getLockOwner) => (nodeID: string) => getLockOwner(LockType.EDIT, nodeID));

/**
 * get the team member who has the resource locked
 */
export const resourceLockOwnerSelector = createSelector(
  [realtimeLocksSelector, resourceLockOwnerTabIDSelector, Workspace.distinctWorkspaceMemberSelector],
  (locks, getTabID, getWorkspaceMember) => (resourceType: ResourceType) => {
    const tabID = getTabID(resourceType)!;
    const found =
      locks &&
      Object.values(locks!.users)
        .flatMap(Object.entries)
        .find(([key]) => key === tabID);

    if (found) {
      const [, creatorID] = found;
      return getWorkspaceMember(creatorID, tabID);
    }

    return null;
  }
);

export const isResourceLockedSelector = createSelector([resourceLockOwnerTabIDSelector], (getLockOwnerTabID) => (resourceType: ResourceType) =>
  !!getLockOwnerTabID(resourceType)
);

export const diagramViewersLookupSelector = createSelector(
  [realtimeLocksSelector, Workspace.activeWorkspaceMemberSelector],
  (locks, getWorkspaceMember) => {
    if (!locks) {
      return {};
    }

    return Object.values(locks.users).reduce<Record<string, ReturnType<typeof getWorkspaceMember> & { color: string }>>((acc, usersInDiagram) => {
      Object.entries(usersInDiagram).forEach(([tabID, creatorID]) => {
        const member = getWorkspaceMember(creatorID);
        if (member) {
          acc[tabID] = { ...member, color: getAlternativeColor(tabID) };
        }
      });

      return acc;
    }, {});
  }
);
