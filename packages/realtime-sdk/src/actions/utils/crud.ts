import { Utils } from '@voiceflow/common';
import { ActionCreator, AnyAction } from 'typescript-fsa';
import { ValuesType } from 'utility-types';

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
  to: string;
  from: string;
}

export interface CRUDActionCreators<T, D, P extends Partial<D> = Partial<D>> {
  add: ActionCreator<T & CRUDValuePayload<D>>;
  addMany: ActionCreator<T & CRUDValuesPayload<D>>;
  prepend: ActionCreator<T & CRUDValuePayload<D>>;
  update: ActionCreator<T & CRUDValuePayload<D>>;
  patch: ActionCreator<T & CRUDValuePayload<P>>;
  remove: ActionCreator<T & CRUDKeyPayload>;
  removeMany: ActionCreator<T & CRUDKeysPayload>;
  refresh: ActionCreator<T>;
  replace: ActionCreator<T & CRUDValuesPayload<D>>;
  reorder: ActionCreator<T & CRUDKeysPayload>;
  move: ActionCreator<T & CRUDMovePayload>;
}

export type ClientCRUDActionCreators<T, D, P extends Partial<D> = Partial<D>> = Pick<
  CRUDActionCreators<T, D, P>,
  'update' | 'patch' | 'remove' | 'removeMany' | 'reorder' | 'move'
>;

export type ClientCRUDPayload<T, D, P extends Partial<D> = Partial<D>> = ReturnType<ValuesType<ClientCRUDActionCreators<T, D, P>>>['payload'];

export const createCRUDActions = <T, D, P extends Partial<D> = Partial<D>>(createType: (name: string) => string): CRUDActionCreators<T, D, P> => ({
  add: Utils.protocol.createAction<T & CRUDValuePayload<D>>(createType('CRUD:ADD')),
  addMany: Utils.protocol.createAction<T & CRUDValuesPayload<D>>(createType('CRUD:ADD_MANY')),
  prepend: Utils.protocol.createAction<T & CRUDValuePayload<D>>(createType('CRUD:PREPEND')),
  update: Utils.protocol.createAction<T & CRUDValuePayload<D>>(createType('CRUD:UPDATE')),
  patch: Utils.protocol.createAction<T & CRUDValuePayload<P>>(createType('CRUD:PATCH')),
  remove: Utils.protocol.createAction<T & CRUDKeyPayload>(createType('CRUD:REMOVE')),
  removeMany: Utils.protocol.createAction<T & CRUDKeysPayload>(createType('CRUD:REMOVE_MANY')),
  refresh: Utils.protocol.createAction<T>(createType('CRUD:REFRESH')),
  replace: Utils.protocol.createAction<T & CRUDValuesPayload<D>>(createType('CRUD:REPLACE')),
  reorder: Utils.protocol.createAction<T & CRUDKeysPayload>(createType('CRUD:REORDER')),
  move: Utils.protocol.createAction<T & CRUDMovePayload>(createType('CRUD:MOVE')),
});

/**
 * extracts targets from actions targeting server-managed resources
 * won't be used for sub-resources (such as nodes) as they do not require
 * independent checks for authorization (done instead on the parent diagram resource)
 */
export const getCRUDActionTargets = <T, D, P extends Partial<D> = Partial<D>>(
  actionCreators: ClientCRUDActionCreators<T, D, P>,
  action: AnyAction
): string[] | null => {
  if (actionCreators.remove.match(action) || actionCreators.update.match(action) || actionCreators.patch.match(action)) {
    return [action.payload.key];
  }

  if (actionCreators.reorder.match(action) || actionCreators.removeMany.match(action)) {
    return action.payload.keys;
  }

  if (actionCreators.move.match(action)) {
    return [action.payload.from, action.payload.to];
  }

  return null;
};
