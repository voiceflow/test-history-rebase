export const STATE_KEY = 'realtime';

export enum ServerAction {
  DELETE_BLOCK = 'BLOCK_DELETION',
}

export enum LockType {
  MOVEMENT = 'movement',
  EDIT = 'edit',
  RESOURCE = 'resource',
}

export enum ResourceType {
  DIAGRAM = 'diagram',
  VARIABLES = 'variables',
  INTENTS = 'intents',
  SLOTS = 'slots',
  FLOWS = 'flows',
  PRODUCTS = 'products',
  SETTINGS = 'settings',
}

export enum LockAction {
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
}
