import type { Enum } from '@/utils/type/enum.util';

export const EntityLockType = {
  NODE_EDIT: 'NODE_EDIT',
  NODE_MOVEMENT: 'NODE_MOVEMENT',
} as const;

export type EntityLockType = Enum<typeof EntityLockType>;
