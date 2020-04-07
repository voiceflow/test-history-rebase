import { createSelector } from 'reselect';

import { Action } from '@/store/types';
import {
  GetKey,
  addAllNormalizedByKeys,
  addNormalizedByKey,
  defaultGetKey,
  denormalize,
  getNormalizedByKey,
  normalize,
  removeNormalizedByKey,
  reorderKeys,
  updateNormalizedByKey,
} from '@/utils/normalized';

import { createAction, createRootSelector } from '.';

export type DefaultState<T> = {
  allKeys: string[];
  byKey: Record<string, T>;
};

export type Meta = {
  modelType?: string;
};

export const DEFAULT_STATE = {
  allKeys: [] as string[],
  byKey: {} as Record<string, unknown>,
};

// actions

export const CRUD_ADD = 'CRUD:ADD';
export type CrudAdd<T, M extends Meta = Meta> = Action<typeof CRUD_ADD, { key: string; value: T }, M>;

export const CRUD_ADD_MANY = 'CRUD:ADD_MANY';
export type CrudAddMany<T, M extends Meta = Meta> = Action<typeof CRUD_ADD_MANY, T[], M>;

export const CRUD_UPDATE = 'CRUD:UPDATE';
export type CrudUpdate<T, M extends Meta = Meta> = Action<typeof CRUD_UPDATE, { key: string; value: T; patch?: boolean }, M>;

export const CRUD_REMOVE = 'CRUD:REMOVE';
export type CrudRemove<M extends Meta = Meta> = Action<typeof CRUD_REMOVE, string, M>;

export const CRUD_REPLACE = 'CRUD:REPLACE';
export type CrudReplace<T, M extends Meta = Meta> = Action<typeof CRUD_REPLACE, T[], M>;

export const CRUD_REORDER = 'CRUD:REORDER';
export type CrudReorder<M extends Meta = Meta> = Action<typeof CRUD_REORDER, string[], M>;

export type CrudActionType =
  | typeof CRUD_ADD
  | typeof CRUD_ADD_MANY
  | typeof CRUD_UPDATE
  | typeof CRUD_REMOVE
  | typeof CRUD_REPLACE
  | typeof CRUD_REORDER;

export type CrudAction<T> = CrudAdd<T> | CrudAddMany<T> | CrudUpdate<T> | CrudRemove | CrudReplace<T> | CrudReorder;

export type CrudTypedAction<T> = {
  [CRUD_ADD]: CrudAdd<T>;
  [CRUD_ADD_MANY]: CrudAddMany<T>;
  [CRUD_UPDATE]: CrudUpdate<T>;
  [CRUD_REMOVE]: CrudRemove;
  [CRUD_REPLACE]: CrudReplace<T>;
  [CRUD_REORDER]: CrudReorder;
};

// reducers

export const crudReorderReducer = <T, S extends DefaultState<T> = DefaultState<T>>({ byKey }: S, { payload }: CrudReorder) =>
  reorderKeys(payload, byKey);

export const crudAddReducer = <T, S extends DefaultState<T> = DefaultState<T>>(state: S, { payload: { key, value } }: CrudAdd<T>) =>
  addNormalizedByKey(state, key, value);

export const crudAddManyReducer = <T, K extends GetKey<T> = (obj: T) => string, S extends DefaultState<T> = DefaultState<T>>(
  state: S,
  { payload: values }: CrudAddMany<T>,
  getKey: K
) => addAllNormalizedByKeys(state, values, getKey);

export const crudUpdateReducer = <T, S extends DefaultState<T> = DefaultState<T>>(state: S, { payload: { key, value, patch } }: CrudUpdate<T>) =>
  updateNormalizedByKey(state, key, patch ? { ...getNormalizedByKey(state, key), ...value } : value);

export const crudRemoveReducer = <T, S extends DefaultState<T> = DefaultState<T>>(state: S, { payload: key }: CrudRemove) =>
  removeNormalizedByKey(state, key);

export const crudReplaceReducer = <T, K extends GetKey<T> = (obj: T) => string>({ payload: values }: CrudReplace<T>, getKey: K) =>
  normalize(values, getKey);

const createCRUDReducer = <T, K extends GetKey<T> = (obj: T) => string, S extends DefaultState<T> = DefaultState<T>>(
  modelType: string,
  getKey?: K
) => (state: S = DEFAULT_STATE as S, action: CrudAction<T>) => {
  const keyGetter = getKey ?? ((defaultGetKey as unknown) as K);

  if (!action.meta || action.meta.modelType !== modelType) {
    return state;
  }

  switch (action.type) {
    case CRUD_ADD:
      return crudAddReducer(state, action);
    case CRUD_ADD_MANY:
      return crudAddManyReducer(state, action, keyGetter);
    case CRUD_UPDATE:
      return crudUpdateReducer(state, action);
    case CRUD_REMOVE:
      return crudRemoveReducer(state, action);
    case CRUD_REPLACE:
      return crudReplaceReducer(action, keyGetter);
    case CRUD_REORDER:
      return crudReorderReducer(state, action);
    default:
      return state;
  }
};

export default createCRUDReducer;

// selectors

export const createCRUDSelectors = <T, S extends DefaultState<T> = DefaultState<T>>(modelType: string) => {
  const root = createRootSelector<S>(modelType);
  const all = createSelector(root, denormalize);
  const collect = createSelector(root, (models) => <R>(collector: (state: S) => R) => collector(models));
  const map = createSelector(root, ({ byKey }) => byKey);
  const key = createSelector(root, ({ allKeys }) => allKeys);

  return {
    root,
    all,
    map,
    key,
    findByIDs: createSelector(collect, (findModels) => (ids: string[]) =>
      findModels(({ allKeys, byKey }: S) =>
        ids.reduce<T[]>((acc, id) => {
          if (allKeys.includes(id)) {
            acc.push(byKey[id]);
          }

          return acc;
        }, [])
      )
    ),
    byID: createSelector(root, (normalized) => (id: string) => getNormalizedByKey(normalized, id)),
    has: createSelector(root, ({ allKeys }) => allKeys.length !== 0),
  };
};

// action creators

export const crudAction = <T extends CrudActionType, P, M extends Meta = Meta>(modelType: string, type: T, payload: P, meta?: M) =>
  createAction(type, payload, { modelType, ...meta });

export const addModel = <T>(modelType: string) => (key: string, value: T) => crudAction(modelType, CRUD_ADD, { key, value });

export const addManyModels = <T>(modelType: string) => (values: T[]) => crudAction(modelType, CRUD_ADD_MANY, values);

export const updateModel = <T, P extends boolean>(modelType: string) => (key: string, value: P extends true ? Partial<T> : T, patch?: P) =>
  crudAction(modelType, CRUD_UPDATE, { key, value, patch: patch ?? false });

export const removeModel = (modelType: string) => (key: string) => crudAction(modelType, CRUD_REMOVE, key);

export const replaceModels = <T, M extends Meta = Meta>(modelType: string) => (values: T[], meta?: M) =>
  crudAction(modelType, CRUD_REPLACE, values, meta);

export const reorderModels = (modelType: string) => (keyArray: string[]) => crudAction(modelType, CRUD_REORDER, keyArray);

export const createCRUDActionCreators = (modelType: string) => ({
  add: addModel(modelType),
  addMany: addManyModels(modelType),
  update: updateModel(modelType),
  remove: removeModel(modelType),
  replace: replaceModels(modelType),
  reorder: reorderModels(modelType),
});
