import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';
import { createSelector } from 'reselect';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { createCurriedSelector, createRootSelector } from '@/ducks/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { LockType, STATE_KEY } from './constants';
import { AnyNodeLock } from './types';

const rootSelector = createRootSelector(STATE_KEY);

/**
 * @deprecated
 */
export const realtimeDiagramIDSelector = createSelector([rootSelector], ({ diagramID }) => diagramID);

const realtimeLocksSelector = createSelector([rootSelector], ({ locks }) => locks);

export const isRealtimeLoadedSelector = createSelector([realtimeLocksSelector], Boolean);

export const isRealtimeConnectedSelector = createSelector([rootSelector], ({ connected }) => connected);

export const isErrorStateSelector = createSelector([rootSelector], ({ errorState }) => errorState);

const isNodeLockedSelector = createSelector(
  [realtimeLocksSelector],
  (locks) => (lockType: AnyNodeLock, nodeID: string) => !!locks?.blocks[lockType]?.[nodeID]
);

export const isTabRegisteredSelector = createSelector(
  [realtimeLocksSelector],
  (locks) => (tabID: string) =>
    Object.values(locks?.users ?? {})
      .flatMap(Object.keys)
      .some((id) => id === tabID)
);

/**
 * @deprecated
 */
const _isNodeMovementLockedSelector = createSelector(
  [isNodeLockedSelector],
  (isNodeLocked) => (nodeID: string) => isNodeLocked(LockType.MOVEMENT, nodeID)
);

const getIsActiveDiagramNodeMovementLockedSelector = createSelector(
  [createCurriedSelector(DiagramV2.isActiveDiagramEntityLockedByIDAndTypeSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT })
);

export const isNodeMovementLockedSelector = Feature.createAtomicActionsPhase2Selector([
  _isNodeMovementLockedSelector,
  getIsActiveDiagramNodeMovementLockedSelector,
]);

/**
 * @deprecated
 */
const _isNodeEditLockedSelector = createSelector([isNodeLockedSelector], (isNodeLocked) => (nodeID: string) => isNodeLocked(LockType.EDIT, nodeID));

const getIsActiveDiagramNodeEditLockedSelector = createSelector(
  [createCurriedSelector(DiagramV2.isActiveDiagramEntityLockedByIDAndTypeSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_EDIT })
);

export const isNodeEditLockedSelector = Feature.createAtomicActionsPhase2Selector([
  _isNodeEditLockedSelector,
  getIsActiveDiagramNodeEditLockedSelector,
]);

/**
 * @deprecated
 */
const _deletionLockedNodesSelector = createSelector(
  [realtimeLocksSelector],
  (locks): Record<string, string> => ({ ...locks?.blocks[LockType.MOVEMENT], ...locks?.blocks[LockType.EDIT] })
);

export const deletionLockedNodesSelector = Feature.createAtomicActionsPhase2Selector([
  _deletionLockedNodesSelector,
  DiagramV2.activeDiagramDeletionLockedNodesSelector,
]);

const lockOwnerTabIDSelector = createSelector(
  [realtimeLocksSelector],
  (locks) => (lockType: AnyNodeLock, nodeID: string) => locks?.blocks[lockType]?.[nodeID]
);

export const isSessionBusy = createSelector([rootSelector], ({ sessionBusy }) => sessionBusy);

export const isRestrictedSelector = createSelector([rootSelector], ({ restricted }) => restricted);

const creatorMappingSelector = createSelector(
  [realtimeLocksSelector, lockOwnerTabIDSelector],
  (locks, getTabID) =>
    (lockType: AnyNodeLock, nodeID: string, diagramID: string): [string, string?] => {
      const tabID = getTabID(lockType, nodeID)!;

      return [tabID, locks?.users[diagramID]?.[tabID]];
    }
);

const lockOwnerSelector = createSelector(
  [CreatorV2.activeDiagramIDSelector, creatorMappingSelector, WorkspaceV2.active.getDistinctWorkspaceMemberByCreatorIDSelector],
  (diagramID, getCreatorMapping, getWorkspaceMember) => (lockType: AnyNodeLock, nodeID: string) => {
    if (!diagramID) return null;

    const [tabID, creatorID] = getCreatorMapping(lockType, nodeID, diagramID);
    return creatorID ? getWorkspaceMember(Number(creatorID), tabID) : null;
  }
);

/**
 * get the team member who has the node edit locked
 * @deprecated
 */
const _editLockOwnerSelector = createSelector([lockOwnerSelector], (getLockOwner) => (nodeID: string) => getLockOwner(LockType.EDIT, nodeID));

const getIsActiveDiagramNodeEditLockOwnerSelector = createSelector(
  [createCurriedSelector(DiagramV2.activeDiagramLockOwnerSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_EDIT })
);

export const editLockOwnerSelector = Feature.createAtomicActionsPhase2Selector([_editLockOwnerSelector, getIsActiveDiagramNodeEditLockOwnerSelector]);

/**
 * get the team member who has the node edit locked
 * @deprecated
 */
export const diagramViewersLookupSelector = createSelector(
  [realtimeLocksSelector, WorkspaceV2.active.getMemberByIDSelector],
  (locks, getWorkspaceMember) => {
    if (!locks) {
      return {};
    }

    return Object.values(locks.users).reduce<Record<string, ReturnType<typeof getWorkspaceMember> & { color: string }>>((acc, usersInDiagram) => {
      Object.entries(usersInDiagram).forEach(([tabID, creatorID]) => {
        const member = getWorkspaceMember({ creatorID: Number(creatorID) });
        if (member) {
          acc[tabID] = { ...member, color: getAlternativeColor(tabID) };
        }
      });

      return acc;
    }, {});
  }
);

const projectViewerCountSelector = createSelector([realtimeLocksSelector, WorkspaceV2.active.workspaceSelector], (locks, team) => {
  if (!locks || !team) {
    return 1;
  }

  return Object.values(locks.users).reduce((acc, diagramLocks) => {
    Object.keys(diagramLocks || {}).forEach((tabID) => acc.add(tabID));

    return acc;
  }, new Set()).size;
});

const _isOnlyViewerSelector = createSelector([projectViewerCountSelector], (projectViewerCount) => projectViewerCount === 1);

export const isOnlyViewerSelector = Feature.createAtomicActionsPhase2Selector([_isOnlyViewerSelector, DiagramV2.isOnlyViewerSelector]);

/**
 * gets all members for a given diagram
 */
const diagramViewersSelector = createSelector(
  [realtimeLocksSelector, WorkspaceV2.active.getMemberByIDSelector],
  (locks, getWorkspaceMember) => (diagramID: string) => {
    if (!locks || !diagramID) {
      return [];
    }

    return Object.entries(locks.users[diagramID] || {}).map(([tabID, creatorID]) => ({
      tabID,
      ...getWorkspaceMember({ creatorID: Number(creatorID) })!,
      color: getAlternativeColor(tabID),
    }));
  }
);

/**
 * @deprecated
 */
export const activeDiagramViewersSelector = createSelector([diagramViewersSelector, Session.activeDiagramIDSelector], (getViewers, diagramID) =>
  diagramID ? getViewers(diagramID) : []
);

/**
 * @deprecated
 */
const _activeDiagramViewersCountSelector = createSelector([diagramViewersSelector, Session.activeDiagramIDSelector], (getViewers, diagramID) =>
  diagramID ? getViewers(diagramID).length : 0
);

const activeDiagramViewersCountSelectorV2 = createSelector(
  [createCurriedSelector(DiagramV2.diagramViewersByIDSelector), Session.activeDiagramIDSelector],
  (getViewers, diagramID) => getViewers({ id: diagramID }).length
);

export const activeDiagramViewersCountSelector = Feature.createAtomicActionsPhase2Selector([
  _activeDiagramViewersCountSelector,
  activeDiagramViewersCountSelectorV2,
]);
