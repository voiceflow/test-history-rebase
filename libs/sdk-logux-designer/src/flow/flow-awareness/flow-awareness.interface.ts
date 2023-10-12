import type { EntityLockType } from '@/common';

export type FlowHeartbeatLocksMap = Partial<Record<EntityLockType, string[]>>;
