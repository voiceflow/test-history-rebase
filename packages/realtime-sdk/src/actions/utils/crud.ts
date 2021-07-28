import { ActionCreator } from 'typescript-fsa';

import { createAction } from './base';

export interface CRUDKeyPayload {
  key: string;
}

export interface CRUDKeysPayload {
  keys: string[];
}

export interface CRUDValuePayload<T> extends CRUDKeyPayload {
  value: T;
}

export interface CRUDValuesPayload<T> {
  values: T[];
}

export interface CRUDMovePayload {
  to: string | number;
  from: string | number;
}

export interface CRUDActionCreators<T, D, P extends Partial<D> = Partial<D>> {
  add: ActionCreator<T & CRUDValuePayload<D>>;
  addMany: ActionCreator<T & CRUDValuesPayload<D>>;
  prepend: ActionCreator<T & CRUDValuePayload<D>>;
  update: ActionCreator<T & CRUDValuePayload<D>>;
  patch: ActionCreator<T & CRUDValuePayload<P>>;
  remove: ActionCreator<T & CRUDKeyPayload>;
  removeMany: ActionCreator<T & CRUDKeysPayload>;
  replace: ActionCreator<T & CRUDValuesPayload<D>>;
  reorder: ActionCreator<T & CRUDKeysPayload>;
  move: ActionCreator<T & CRUDMovePayload>;
}

export const createCrudActions = <T, D, P extends Partial<D> = Partial<D>>(createType: (name: string) => string): CRUDActionCreators<T, D, P> => ({
  add: createAction<T & CRUDValuePayload<D>>(createType('CRUD:ADD')),
  addMany: createAction<T & CRUDValuesPayload<D>>(createType('CRUD:ADD_MANY')),
  prepend: createAction<T & CRUDValuePayload<D>>(createType('CRUD:PREPEND')),
  update: createAction<T & CRUDValuePayload<D>>(createType('CRUD:UPDATE')),
  patch: createAction<T & CRUDValuePayload<P>>(createType('CRUD:PATCH')),
  remove: createAction<T & CRUDKeyPayload>(createType('CRUD:REMOVE')),
  removeMany: createAction<T & CRUDKeysPayload>(createType('CRUD:REMOVE_MANY')),
  replace: createAction<T & CRUDValuesPayload<D>>(createType('CRUD:REPLACE')),
  reorder: createAction<T & CRUDKeysPayload>(createType('CRUD:REORDER')),
  move: createAction<T & CRUDMovePayload>(createType('CRUD:MOVE')),
});
