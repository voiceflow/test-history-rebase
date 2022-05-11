import { AWARENESS_KEY } from '@realtime-sdk/constants';
import { BaseDiagramPayload, Point } from '@realtime-sdk/types';
import { Nullable, Utils } from '@voiceflow/common';

import { diagramType } from './utils';

export enum LockEntityType {
  NODE_EDIT = 'node_edit',
  NODE_MOVEMENT = 'node_movement',
}

const diagramAwarenessType = Utils.protocol.typeFactory(diagramType(AWARENESS_KEY));

export interface BaseCursorPayload extends BaseDiagramPayload {
  creatorID: number;
}

export interface MoveCursorPayload extends BaseCursorPayload {
  coords: Point;
}

export type HeartbeatLocksMap = Partial<Record<LockEntityType, string[]>>;

export interface HeartbeatPayload extends BaseDiagramPayload {
  lock: Nullable<{ type: LockEntityType; entityIDs: string[] }>;
  unlock: Nullable<{ type: LockEntityType; entityIDs: string[] }>;
  locksMap: HeartbeatLocksMap;
  forceSync: boolean;
}

export interface LockUnlockEntityPayload extends BaseDiagramPayload {
  lockType: LockEntityType;
  entityIDs: string[];
  loguxNodeID: string;
}

export interface UpdateLocksPayload extends BaseDiagramPayload {
  locks: Partial<Record<LockEntityType, Record<string, string>>>;
}

export const hideCursor = Utils.protocol.createAction<BaseCursorPayload>(diagramAwarenessType('HIDE_CURSOR'));
export const moveCursor = Utils.protocol.createAction<MoveCursorPayload>(diagramAwarenessType('MOVE_CURSOR'));

export const heartbeat = Utils.protocol.createAction<HeartbeatPayload>(diagramAwarenessType('HEARTBEAT'));

export const lockEntities = Utils.protocol.createAction<LockUnlockEntityPayload>(diagramAwarenessType('LOCK_ENTITIES'));
export const unlockEntities = Utils.protocol.createAction<LockUnlockEntityPayload>(diagramAwarenessType('UNLOCK_ENTITIES'));
export const updateLockedEntities = Utils.protocol.createAction<UpdateLocksPayload>(diagramAwarenessType('UPDATE_LOCKED_ENTITIES'));
