import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { createCurriedSelector, createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

/**
 * @deprecated
 */
export const realtimeDiagramIDSelector = createSelector([rootSelector], ({ diagramID }) => diagramID);

const realtimeLocksSelector = createSelector([rootSelector], ({ locks }) => locks);

export const isRealtimeLoadedSelector = createSelector([realtimeLocksSelector], Boolean);

export const isRealtimeConnectedSelector = createSelector([rootSelector], ({ connected }) => connected);

export const isErrorStateSelector = createSelector([rootSelector], ({ errorState }) => errorState);

export const isTabRegisteredSelector = createSelector(
  [realtimeLocksSelector],
  (locks) => (tabID: string) =>
    Object.values(locks?.users ?? {})
      .flatMap(Object.keys)
      .some((id) => id === tabID)
);

const getIsActiveDiagramNodeMovementLockedSelector = createSelector(
  [createCurriedSelector(DiagramV2.isActiveDiagramEntityLockedByIDAndTypeSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT })
);

export const isNodeMovementLockedSelector = getIsActiveDiagramNodeMovementLockedSelector;

const getIsActiveDiagramNodeEditLockedSelector = createSelector(
  [createCurriedSelector(DiagramV2.isActiveDiagramEntityLockedByIDAndTypeSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_EDIT })
);

export const isNodeEditLockedSelector = getIsActiveDiagramNodeEditLockedSelector;

export const deletionLockedNodesSelector = DiagramV2.activeDiagramDeletionLockedNodesSelector;

export const isSessionBusy = createSelector([rootSelector], ({ sessionBusy }) => sessionBusy);

export const isRestrictedSelector = createSelector([rootSelector], ({ restricted }) => restricted);

const getIsActiveDiagramNodeEditLockOwnerSelector = createSelector(
  [createCurriedSelector(DiagramV2.activeDiagramLockOwnerSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_EDIT })
);

export const editLockOwnerSelector = getIsActiveDiagramNodeEditLockOwnerSelector;

export const { isOnlyViewerSelector } = DiagramV2;

const activeDiagramViewersCountSelectorV2 = createSelector(
  [createCurriedSelector(DiagramV2.diagramViewersByIDSelector), Session.activeDiagramIDSelector],
  (getViewers, diagramID) => getViewers({ id: diagramID }).length
);

export const activeDiagramViewersCountSelector = activeDiagramViewersCountSelectorV2;
