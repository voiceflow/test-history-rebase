/* eslint-disable @typescript-eslint/ban-types */
import { Utils } from '@voiceflow/common';
import type { ActionCreator, AnyAction } from 'typescript-fsa';
import type { ValuesType } from 'utility-types';

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
  fromID: string;
  toIndex: number;
}

export interface CRUDActionCreators<Model, Context extends object = {}, Patch extends Partial<Model> = Partial<Model>> {
  add: ActionCreator<CRUDValuePayload<Model> & Context>;
  addMany: ActionCreator<CRUDValuesPayload<Model> & Context>;
  prepend: ActionCreator<CRUDValuePayload<Model> & Context>;
  update: ActionCreator<CRUDValuePayload<Model> & Context>;
  patch: ActionCreator<CRUDValuePayload<Patch> & Context>;
  remove: ActionCreator<CRUDKeyPayload & Context>;
  removeMany: ActionCreator<CRUDKeysPayload & Context>;
  refresh: ActionCreator<Context>;
  replace: ActionCreator<CRUDValuesPayload<Model> & Context>;
  reorder: ActionCreator<CRUDKeysPayload & Context>;
  move: ActionCreator<CRUDMovePayload & Context>;
}

export type ClientCRUDActionCreators<T extends CRUDActionCreators<any, any, any>> = Pick<
  T,
  'update' | 'patch' | 'remove' | 'removeMany' | 'reorder' | 'move'
>;

export type ClientCRUDPayload<
  Model,
  Context extends object = {},
  Patch extends Partial<Model> = Partial<Model>,
> = ReturnType<ValuesType<ClientCRUDActionCreators<CRUDActionCreators<Model, Context, Patch>>>>['payload'];

export const createCRUDActions = <Model, Context extends object = {}, Patch extends Partial<Model> = Partial<Model>>(
  createType: (name: string) => string
): CRUDActionCreators<Model, Context, Patch> => ({
  add: Utils.protocol.createAction<CRUDValuePayload<Model> & Context>(createType('CRUD:ADD')),
  addMany: Utils.protocol.createAction<CRUDValuesPayload<Model> & Context>(createType('CRUD:ADD_MANY')),
  prepend: Utils.protocol.createAction<CRUDValuePayload<Model> & Context>(createType('CRUD:PREPEND')),
  update: Utils.protocol.createAction<CRUDValuePayload<Model> & Context>(createType('CRUD:UPDATE')),
  patch: Utils.protocol.createAction<CRUDValuePayload<Patch> & Context>(createType('CRUD:PATCH')),
  remove: Utils.protocol.createAction<CRUDKeyPayload & Context>(createType('CRUD:REMOVE')),
  removeMany: Utils.protocol.createAction<CRUDKeysPayload & Context>(createType('CRUD:REMOVE_MANY')),
  refresh: Utils.protocol.createAction<Context>(createType('CRUD:REFRESH')),
  replace: Utils.protocol.createAction<CRUDValuesPayload<Model> & Context>(createType('CRUD:REPLACE')),
  reorder: Utils.protocol.createAction<CRUDKeysPayload & Context>(createType('CRUD:REORDER')),
  move: Utils.protocol.createAction<CRUDMovePayload & Context>(createType('CRUD:MOVE')),
});

/**
 * extracts targets from actions targeting server-managed resources
 * won't be used for sub-resources (such as nodes) as they do not require
 * independent checks for authorization (done instead on the parent diagram resource)
 */
export const getCRUDActionTargets = <T extends CRUDActionCreators<any, any, any>>(
  actionCreators: ClientCRUDActionCreators<T>,
  action: AnyAction
): string[] | null => {
  if (
    actionCreators.remove.match(action) ||
    actionCreators.update.match(action) ||
    actionCreators.patch.match(action)
  ) {
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
