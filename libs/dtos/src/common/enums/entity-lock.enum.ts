export const EntityLockType = {
  NODE_EDIT: 'NODE_EDIT',
  NODE_MOVEMENT: 'NODE_MOVEMENT',
} as const;

export type EntityLockType = (typeof EntityLockType)[keyof typeof EntityLockType];
