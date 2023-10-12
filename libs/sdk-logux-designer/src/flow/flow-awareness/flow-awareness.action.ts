import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';

import type { EntityLockType } from '@/common';
import type { ActiveFlowAction } from '@/types';

import { flowAction } from '../flow.action';
import type { FlowHeartbeatLocksMap } from './flow-awareness.interface';

const awarenessType = Utils.protocol.typeFactory(flowAction('awareness'));

export interface HideCursor extends ActiveFlowAction {
  creatorID: number;
}

export const HideCursor = Utils.protocol.createAction<HideCursor>(awarenessType('HIDE_CURSOR'));

export interface Heartbeat extends ActiveFlowAction {
  lock: Nullable<{ ids: string[]; type: EntityLockType }>;
  unlock: Nullable<{ ids: string[]; type: EntityLockType }>;
  locksMap: FlowHeartbeatLocksMap;
  forceSync: boolean;
}

export const Heartbeat = Utils.protocol.createAction<Heartbeat>(awarenessType('HEARTBEAT'));

export interface LockEntities extends ActiveFlowAction {
  ids: string[];
  type: EntityLockType;
  loguxNodeID: string;
}

export const LockEntities = Utils.protocol.createAction<LockEntities>(awarenessType('LOCK_ENTITIES'));

export interface UnlockEntities extends LockEntities {}

export const UnlockEntities = Utils.protocol.createAction<UnlockEntities>(awarenessType('UNLOCK_ENTITIES'));

export interface UpdateLockedEntities extends ActiveFlowAction {
  locks: Partial<Record<EntityLockType, Record<string, string>>>;
}

export const UpdateLockedEntities = Utils.protocol.createAction<UpdateLockedEntities>(
  awarenessType('UPDATE_LOCKED_ENTITIES')
);
