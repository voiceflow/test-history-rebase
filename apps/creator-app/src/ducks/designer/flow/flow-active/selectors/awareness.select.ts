import { parseId } from '@logux/core';
import type { Nullish } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { EntityLockType } from '@voiceflow/sdk-logux-designer';
import { createSelector } from 'reselect';

import { userIDSelector } from '@/ducks/account/selectors';
import { activeFlowIDSelector } from '@/ducks/session/selectors';
import { createCurriedSelector } from '@/ducks/utils';
import { getMemberByIDSelector } from '@/ducks/workspaceV2/selectors/active';
import { getMemberColorByLoguxNodeID } from '@/utils/member.util';

import { locks as flowLocks } from '../../flow-awareness/flow-awareness.select';

const entityIDParamSelector = (_: any, { entityID }: { entityID: string | null }) => entityID;

const entityLockTypeParamSelector = (_: any, { entityLockType }: { entityLockType: EntityLockType }) => entityLockType;

const isLockedByOther = (loguxNodeID: Nullish<string>, creatorID: Nullish<number>) => {
  if (!loguxNodeID) return false;

  const { userId } = parseId(loguxNodeID);

  if (!userId || !creatorID) return true;

  return Number(userId) !== creatorID;
};

export const locks = createSelector([flowLocks, activeFlowIDSelector], (locks, flowID) => (!flowID ? {} : locks[flowID] ?? {}));

export const lockOwnerLoguxNodeIDByEntityIDAndLockType = createSelector(
  [locks, entityIDParamSelector, entityLockTypeParamSelector],
  (locks, entityID, entityLockType) => (entityID ? locks[entityLockType]?.[entityID] ?? null : null)
);

export const isEntityLocked = createSelector([lockOwnerLoguxNodeIDByEntityIDAndLockType, userIDSelector], isLockedByOther);

export const deletionLockedEntityIDs = createSelector([userIDSelector, locks], (creatorID, locks) =>
  Utils.object.pickBy({ ...locks[EntityLockType.NODE_EDIT], ...locks[EntityLockType.NODE_MOVEMENT] }, (_, loguxNodeID) =>
    isLockedByOther(loguxNodeID, creatorID)
  )
);

export const lockOwnerLoguxNodeIDCreatorID = createSelector(
  [lockOwnerLoguxNodeIDByEntityIDAndLockType],
  (loguxNodeID): [null, null] | [string, number] => {
    if (!loguxNodeID) return [null, null];

    const { userId } = parseId(loguxNodeID);
    if (!userId) return [null, null];

    return [loguxNodeID, Number(userId)];
  }
);

export const lockOwner = createSelector(
  [userIDSelector, lockOwnerLoguxNodeIDCreatorID, getMemberByIDSelector],
  (creatorID, [loguxNodeID, lockOwnerID], getMemberByID) => {
    if (!lockOwnerID || !loguxNodeID) return null;
    if (creatorID === lockOwnerID) return null;

    const member = getMemberByID({ creatorID: lockOwnerID });

    if (!member) return null;

    return {
      member,
      loguxColor: getMemberColorByLoguxNodeID(loguxNodeID),
      loguxNodeID,
    };
  }
);

export const getEditLockOwnerByEntityID = createSelector(
  [createCurriedSelector(lockOwner)],
  (getLockOwner) =>
    ({ entityID }: { entityID: string }) =>
      getLockOwner({ entityID, entityLockType: EntityLockType.NODE_EDIT })
);

export const isNodeEditLockedByEntityID = createSelector(
  [createCurriedSelector(isEntityLocked)],
  (isNodeLocked) =>
    ({ entityID }: { entityID: string }) =>
      isNodeLocked({ entityID, entityLockType: EntityLockType.NODE_EDIT })
);

export const isNodeMovementLockedByEntityID = createSelector(
  [createCurriedSelector(isEntityLocked)],
  (isNodeLocked) =>
    ({ entityID }: { entityID: string }) =>
      isNodeLocked({ entityID, entityLockType: EntityLockType.NODE_MOVEMENT })
);
