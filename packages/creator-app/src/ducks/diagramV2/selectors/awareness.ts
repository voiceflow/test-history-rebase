import { parseId } from '@logux/core';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _uniqBy from 'lodash/uniqBy';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { activeDiagramIDSelector } from '@/ducks/creatorV2/selectors';
import { createParameterSelector, creatorIDParamSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { INITIAL_DIAGRAM_VIEWERS } from '../constants';
import { rootDiagramSelector } from './base';

const entityIDParamSelector = createParameterSelector((params: { entityID: string }) => params.entityID);

const lockTypeParamSelector = createParameterSelector((params: { lockType: Realtime.diagram.awareness.LockEntityType }) => params.lockType);

export const awarenessStateSelector = createSelector([rootDiagramSelector], (state) => state.awareness);

export const awarenessLocksSelector = createSelector([awarenessStateSelector], (awareness) => awareness.locks);

export const awarenessViewersSelector = createSelector([awarenessStateSelector], (awareness) => awareness.viewers);

export const diagramNormalizedViewersByIDSelector = createSelector([awarenessViewersSelector, idParamSelector], (awarenessViewers, diagramID) =>
  diagramID && Utils.object.hasProperty(awarenessViewers, diagramID) ? awarenessViewers[diagramID] : INITIAL_DIAGRAM_VIEWERS
);

export const allViewersCountSelector = createSelector(
  [awarenessViewersSelector, WorkspaceV2.active.hasWorkspaceSelector],
  (viewers, hasWorkspace) => {
    if (!hasWorkspace) return 1;

    return new Set(Object.values(viewers).flatMap((diagramViewers) => diagramViewers.allKeys)).size;
  }
);

export const isOnlyViewerSelector = createSelector([allViewersCountSelector], (viewersCount) => viewersCount === 1);

export const diagramViewersByIDSelector = createSelector([diagramNormalizedViewersByIDSelector], (normalizedViewers) =>
  Normal.denormalize(normalizedViewers)
);

export const diagramsViewersByIDsSelector = createSelector([awarenessViewersSelector, idsParamSelector], (awarenessViewers, diagramIDs) =>
  _uniqBy(
    diagramIDs.flatMap((diagramID) => Normal.denormalize(awarenessViewers[diagramID] ?? INITIAL_DIAGRAM_VIEWERS)),
    'creatorID'
  )
);

export const hasExternalDiagramViewersByIDSelector = createSelector(
  [diagramNormalizedViewersByIDSelector],
  (normalizedViewers) => normalizedViewers.allKeys.length > 1
);

export const diagramViewerByIDAndCreatorIDSelector = createSelector(
  [diagramNormalizedViewersByIDSelector, creatorIDParamSelector],
  (normalizedViewers, creatorID) => Normal.getOne(normalizedViewers, String(creatorID))
);

export const activeDiagramLocksSelector = createSelector([awarenessLocksSelector, activeDiagramIDSelector], (locks, diagramID) =>
  !diagramID ? {} : locks[diagramID] ?? {}
);

export const isActiveDiagramEntityLockedByIDAndTypeSelector = createSelector(
  [activeDiagramLocksSelector, entityIDParamSelector, lockTypeParamSelector],
  (diagramLocks, entityID, lockType) => diagramLocks[lockType]?.[entityID] != null
);

export const activeDiagramDeletionLockedNodesSelector = createSelector([activeDiagramLocksSelector], (diagramLocks) => ({
  ...diagramLocks[Realtime.diagram.awareness.LockEntityType.NODE_EDIT],
  ...diagramLocks[Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT],
}));

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
  [activeDiagramLockOwnerClientNodeIDCreatorIDSelector, WorkspaceV2.active.getDistinctWorkspaceMemberByCreatorIDSelector],
  ([clientNodeID, creatorID], getWorkspaceMember) => (creatorID && clientNodeID ? getWorkspaceMember(creatorID, clientNodeID) : null)
);
