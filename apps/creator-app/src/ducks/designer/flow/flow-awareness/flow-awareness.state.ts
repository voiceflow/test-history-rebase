import type { EntityLockType } from '@voiceflow/sdk-logux-designer';

export const STATE_KEY = 'awareness';

export interface FlowLookup<T> {
  [flowID: string]: T | undefined;
}

export interface NodeLookup<T> {
  [nodeID: string]: T | undefined;
}

export type FlowLocks = Partial<Record<EntityLockType, NodeLookup<string>>>;

export interface FlowAwarenessState {
  locks: FlowLookup<FlowLocks>;
}

export const INITIAL_STATE: FlowAwarenessState = {
  locks: {},
};
