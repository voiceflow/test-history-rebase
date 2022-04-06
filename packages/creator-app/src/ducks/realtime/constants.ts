export const STATE_KEY = 'realtime';

export enum ServerAction {
  DELETE_BLOCK = 'BLOCK_DELETION',
}

export enum LockType {
  MOVEMENT = 'movement',
  EDIT = 'edit',
}

export enum LockAction {
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
}
