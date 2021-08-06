import { LockType, ResourceType } from './constants';

export type AnyNodeLock = LockType.MOVEMENT | LockType.EDIT;

export interface RealtimeLocks {
  blocks: Record<LockType.EDIT | LockType.MOVEMENT, Record<string, string>>;

  users: Record<string, Record<string, string>>;

  resources: Partial<Record<ResourceType, string>>;
}

export interface RealtimeState {
  locks: RealtimeLocks | null;
  diagramID: string | null;
  connected: boolean;
  errorState: boolean;
  sessionBusy: boolean;
  restricted: boolean;
}
