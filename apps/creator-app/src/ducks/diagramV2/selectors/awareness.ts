import { parseId } from '@logux/core';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _uniqBy from 'lodash/uniqBy';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import { activeDiagramIDSelector } from '@/ducks/creatorV2/selectors';
import { awarenessViewersSelector } from '@/ducks/projectV2/selectors/active';
import { createCurriedSelector, createParameterSelector, creatorIDParamSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { getDistinctMemberByCreatorIDSelector, hasWorkspaceSelector } from '@/ducks/workspaceV2/selectors/active';

import { INITIAL_DIAGRAM_VIEWERS } from '../constants';
import { rootDiagramSelector } from './base';

const entityIDParamSelector = createParameterSelector((params: { entityID: string }) => params.entityID);

const lockTypeParamSelector = createParameterSelector((params: { lockType: Realtime.diagram.awareness.LockEntityType }) => params.lockType);

export const awarenessStateSelector = createSelector([rootDiagramSelector], (state) => state.awareness);

export const awarenessLocksSelector = createSelector([awarenessStateSelector], (awareness) => awareness.locks);

export const diagramNormalizedViewersByIDSelector = createSelector([awarenessViewersSelector, idParamSelector], (awarenessViewers, diagramID) =>
  diagramID && awarenessViewers && Utils.object.hasProperty(awarenessViewers, diagramID) ? awarenessViewers[diagramID] : INITIAL_DIAGRAM_VIEWERS
);

export const allViewersCountSelector = createSelector([awarenessViewersSelector, hasWorkspaceSelector], (viewers, hasWorkspace) => {
  if (!hasWorkspace || !viewers) return 1;

  return new Set(Object.values(viewers).flatMap((diagramViewers) => diagramViewers.allKeys)).size || 1;
});

export const isOnlyViewerSelector = createSelector([allViewersCountSelector], (viewersCount) => viewersCount === 1);

export const diagramViewersByIDSelector = createSelector([diagramNormalizedViewersByIDSelector], (normalizedViewers) =>
  Normal.denormalize(normalizedViewers)
);

export const diagramsViewersByIDsSelector = createSelector([awarenessViewersSelector, idsParamSelector], (awarenessViewers, diagramIDs) =>
  _uniqBy(
    diagramIDs.flatMap((diagramID) => Normal.denormalize(awarenessViewers?.[diagramID] ?? INITIAL_DIAGRAM_VIEWERS)),
    'creatorID'
  )
);

export const hasExternalDiagramViewersByIDSelector = createSelector(
  [diagramNormalizedViewersByIDSelector],
  (normalizedViewers) => normalizedViewers.allKeys.length > 1
);

export const diagramViewerByIDAndCreatorIDSelector = createSelector(
  [diagramNormalizedViewersByIDSelector, creatorIDParamSelector],
  (normalizedViewers, creatorID) => (creatorID !== null ? Normal.getOne(normalizedViewers, String(creatorID)) : null)
);

export const activeDiagramLocksSelector = createSelector([awarenessLocksSelector, activeDiagramIDSelector], (locks, diagramID) =>
  !diagramID ? {} : locks[diagramID] ?? {}
);

const isLockedByOther = (creatorID: Nullish<number>, clientNodeID: Nullish<string>) => {
  if (!clientNodeID) return false;

  const { userId } = parseId(clientNodeID);

  if (!userId || !creatorID) return true;

  return Number(userId) !== creatorID;
};

export const isActiveDiagramEntityLockedByIDAndTypeSelector = createSelector(
  [Account.userIDSelector, activeDiagramLocksSelector, entityIDParamSelector, lockTypeParamSelector],
  (creatorID, diagramLocks, entityID, lockType) => {
    const clientNodeID = diagramLocks[lockType]?.[entityID];

    return isLockedByOther(creatorID, clientNodeID);
  }
);

export const activeDiagramDeletionLockedNodesSelector = createSelector(
  [Account.userIDSelector, activeDiagramLocksSelector],
  (creatorID, diagramLocks) =>
    Utils.object.pickBy(
      {
        ...diagramLocks[Realtime.diagram.awareness.LockEntityType.NODE_EDIT],
        ...diagramLocks[Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT],
      },
      (_, clientNodeID) => isLockedByOther(creatorID, clientNodeID)
    )
);

const activeDiagramLockOwnerClientNodeIDByTypeAndIDSelector = createSelector(
  [activeDiagramLocksSelector, entityIDParamSelector, lockTypeParamSelector],
  (locks, entityID, lockType) => locks[lockType]?.[entityID] ?? null
);

const activeDiagramLockOwnerClientNodeIDCreatorIDSelector = createSelector(
  [activeDiagramLockOwnerClientNodeIDByTypeAndIDSelector],
  (clientNodeID): [null, null] | [string, number] => {
    if (!clientNodeID) return [null, null];

    const { userId } = parseId(clientNodeID);
    if (!userId) return [null, null];

    return [clientNodeID, Number(userId)];
  }
);

export const activeDiagramLockOwnerSelector = createSelector(
  [Account.userIDSelector, activeDiagramLockOwnerClientNodeIDCreatorIDSelector, getDistinctMemberByCreatorIDSelector],
  (creatorID, [clientNodeID, lockOwnerID], getWorkspaceMember) => {
    if (!lockOwnerID || !clientNodeID) return null;
    if (creatorID === lockOwnerID) return null;

    return getWorkspaceMember(lockOwnerID, clientNodeID);
  }
);

export const isNodeEditLockedSelector = createSelector(
  [createCurriedSelector(isActiveDiagramEntityLockedByIDAndTypeSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_EDIT })
);

export const editLockOwnerSelector = createSelector(
  [createCurriedSelector(activeDiagramLockOwnerSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_EDIT })
);

export const isNodeMovementLockedSelector = createSelector(
  [createCurriedSelector(isActiveDiagramEntityLockedByIDAndTypeSelector)],
  (isNodeLocked) => (entityID: string) => isNodeLocked({ entityID, lockType: Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT })
);
