import { createSelector } from 'reselect';
import { PickByValue } from 'utility-types';

import type { State } from '@/ducks';
import { Action, RootReducer, Selector } from '@/store/types';
import { reorder } from '@/utils/array';
import {
  addAllNormalizedByKeys,
  addNormalizedByKey,
  addToStartNormalizedByKey,
  defaultGetKey,
  denormalize,
  GetKey,
  getNormalizedByKey,
  normalize,
  Normalized,
  NormalizedValue,
  ObjectWithId,
  removeAllNormalizedByKeys,
  removeNormalizedByKey,
  reorderKeys,
  updateNormalizedByKey,
} from '@/utils/normalized';

import { createAction, createRootSelector } from '.';

export type CRUDState<T> = Normalized<T>;

type CRUDStateSubset = PickByValue<State, CRUDState<any>>;

export type Meta = {
  modelType?: string;
  receivedAction?: boolean;
};

export const INITIAL_STATE: CRUDState<any> = {
  allKeys: [],
  byKey: {},
};

// actions

export enum CRUDAction {
  CRUD_ADD = 'CRUD:ADD',
  CRUD_ADD_MANY = 'CRUD:ADD_MANY',
  CRUD_UPDATE = 'CRUD:UPDATE',
  CRUD_REMOVE = 'CRUD:REMOVE',
  CRUD_REMOVE_MANY = 'CRUD:REMOVE_MANY',
  CRUD_REPLACE = 'CRUD:REPLACE',
  CRUD_REORDER = 'CRUD:REORDER',
  CRUD_MOVE = 'CRUD:MOVE',
  CRUD_PREPEND = 'CRUD:PREPEND',
}

export type CRUDAdd<T, M extends Meta = Meta> = Action<CRUDAction.CRUD_ADD, { key: string; value: T }, M>;

export type CRUDAddMany<T, M extends Meta = Meta> = Action<CRUDAction.CRUD_ADD_MANY, T[], M>;

export type CRUDPrepend<T, M extends Meta = Meta> = Action<CRUDAction.CRUD_PREPEND, { key: string; value: T }, M>;

export type CRUDUpdate<T, M extends Meta = Meta> = Action<CRUDAction.CRUD_UPDATE, { key: string; value: T; patch?: false }, M>;

export type CRUDPatch<T, M extends Meta = Meta> = Action<CRUDAction.CRUD_UPDATE, { key: string; value: Partial<T>; patch: true }, M>;

export type CRUDRemove<M extends Meta = Meta> = Action<CRUDAction.CRUD_REMOVE, string, M>;

export type CRUDRemoveMany<M extends Meta = Meta> = Action<CRUDAction.CRUD_REMOVE_MANY, string[], M>;

export type CRUDReplace<T, M extends Meta = Meta> = Action<CRUDAction.CRUD_REPLACE, T[], M>;

export type CRUDReorder<M extends Meta = Meta> = Action<CRUDAction.CRUD_REORDER, string[], M>;

export type CRUDMove<M extends Meta = Meta> = Action<CRUDAction.CRUD_MOVE, { from: string | number; to: string | number }, M>;

export type AnyCRUDAction<T> =
  | CRUDAdd<T>
  | CRUDAddMany<T>
  | CRUDPrepend<T>
  | CRUDPatch<T>
  | CRUDUpdate<T>
  | CRUDRemove
  | CRUDRemoveMany
  | CRUDReplace<T>
  | CRUDReorder
  | CRUDMove;

// reducers

export const crudReorderReducer = <T, S extends CRUDState<T> = CRUDState<T>>({ byKey }: S, { payload }: CRUDReorder) => reorderKeys(payload, byKey);

export const crudAddReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: { key, value } }: CRUDAdd<T>) =>
  addNormalizedByKey(state, key, value);

export const crudAddManyReducer = <T, K extends GetKey<T> = (obj: T) => string, S extends CRUDState<T> = CRUDState<T>>(
  state: S,
  { payload: values }: CRUDAddMany<T>,
  getKey: K
) => addAllNormalizedByKeys(state, values, getKey);

export const crudPrependReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: { key, value } }: CRUDPrepend<T>) =>
  addToStartNormalizedByKey(state, key, value);

export const crudUpdateReducer = <T, S extends CRUDState<T> = CRUDState<T>>(
  state: S,
  { payload: { key, value, patch } }: CRUDPatch<T> | CRUDUpdate<T>
) => updateNormalizedByKey(state, key, patch ? { ...getNormalizedByKey(state, key), ...value } : value);

export const crudRemoveReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: key }: CRUDRemove) =>
  removeNormalizedByKey(state, key);

export const crudRemoveManyReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: keys }: CRUDRemoveMany) =>
  removeAllNormalizedByKeys(state, keys);

export const crudReplaceReducer = <T, K extends GetKey<T> = (obj: T) => string>({ payload: values }: CRUDReplace<T>, getKey: K) =>
  normalize(values, getKey);

export const crudMoveReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: { from, to } }: CRUDMove) => {
  if (from === to) return state;

  const reordered = reorder(
    state.allKeys,
    typeof from === 'number' ? from : state.allKeys.indexOf(from),
    typeof to === 'number' ? to : state.allKeys.indexOf(to)
  );

  return reorderKeys(reordered, state.byKey);
};

const createCRUDReducer: {
  <T extends ObjectWithId, G extends GetKey<T> = (obj: T) => string, S extends CRUDState<T> = CRUDState<T>>(
    modelType: string,
    getKey?: G
  ): RootReducer<S, AnyCRUDAction<T>>;
  // must provide getKey if object does not extend ObjectWithId
  <T, K extends GetKey<T> = (obj: T) => string, S extends CRUDState<T> = CRUDState<T>>(modelType: string, getKey: K): RootReducer<
    S,
    AnyCRUDAction<T>
  >;
} = (modelType: string, getKey?: (obj: any) => string) => (state = INITIAL_STATE, action: AnyCRUDAction<any>) => {
  const keyGetter = getKey ?? defaultGetKey;

  if (!action.meta || action.meta.modelType !== modelType) {
    return state;
  }

  switch (action.type) {
    case CRUDAction.CRUD_ADD:
      return crudAddReducer(state, action);
    case CRUDAction.CRUD_PREPEND:
      return crudPrependReducer(state, action);
    case CRUDAction.CRUD_ADD_MANY:
      return crudAddManyReducer(state, action, keyGetter);
    case CRUDAction.CRUD_UPDATE:
      return crudUpdateReducer(state, action);
    case CRUDAction.CRUD_REMOVE:
      return crudRemoveReducer(state, action);
    case CRUDAction.CRUD_REMOVE_MANY:
      return crudRemoveManyReducer(state, action);
    case CRUDAction.CRUD_REPLACE:
      return crudReplaceReducer(action, keyGetter);
    case CRUDAction.CRUD_REORDER:
      return crudReorderReducer(state, action);
    case CRUDAction.CRUD_MOVE:
      return crudMoveReducer(state, action);
    default:
      return state;
  }
};

export default createCRUDReducer;

// selectors

export const createCRUDSelectors = <K extends keyof CRUDStateSubset, S extends CRUDStateSubset[K], T extends NormalizedValue<S>>(modelType: K) => {
  const root = createRootSelector<any>(modelType) as Selector<CRUDState<T> & S>;
  const all = createSelector([root], denormalize as any) as Selector<T[]>;
  const collect = createSelector([root], (models) => <R>(collector: (state: S) => R) => collector(models));
  const map = createSelector([root], ({ byKey }): Record<string, T> => byKey);
  const allIDs = createSelector([root], ({ allKeys }): string[] => allKeys);

  return {
    root: root as Selector<S>,
    all,
    map,
    allIDs,
    findByIDs: createSelector([collect], (findModels) => (ids: string[]) =>
      findModels((normalized) =>
        ids.reduce<T[]>((acc, id) => {
          if (normalized.allKeys.includes(id)) {
            acc.push(getNormalizedByKey(normalized as CRUDState<any>, id));
          }

          return acc;
        }, [])
      )
    ),
    byID: createSelector([root], (normalized: CRUDState<T>) => (id: string) => getNormalizedByKey(normalized, id)),
    has: createSelector([root], ({ allKeys }) => allKeys.length !== 0),
  };
};

// action creators

export const crudAction = <T extends CRUDAction, P, M extends Meta = Meta>(modelType: string, type: T, payload: P, meta?: M) =>
  createAction(type, payload, { modelType, ...meta });

export const addModel = <T>(modelType: string) => (key: string, value: T) => crudAction(modelType, CRUDAction.CRUD_ADD, { key, value });

export const addManyModels = <T>(modelType: string) => (values: T[]) => crudAction(modelType, CRUDAction.CRUD_ADD_MANY, values);

export const prependModel = <T>(modelType: string) => (key: string, value: T) => crudAction(modelType, CRUDAction.CRUD_PREPEND, { key, value });

export const updateModel = <T, M extends Meta = Meta>(
  modelType: string
): {
  (key: string, value: Partial<T>, patch: true, meta?: M): CRUDPatch<T>;
  (key: string, value: T, patch?: false, meta?: M): CRUDUpdate<T>;
} => (key: string, value: any, patch = false, meta?: M) => crudAction(modelType, CRUDAction.CRUD_UPDATE, { key, value, patch: patch as any }, meta);

export const patchModel = <T, M extends Meta = Meta>(modelType: string) => (key: string, value: Partial<T>, meta?: M) =>
  crudAction(modelType, CRUDAction.CRUD_UPDATE, { key, value, patch: true }, meta);

export const removeModel = (modelType: string) => (key: string) => crudAction(modelType, CRUDAction.CRUD_REMOVE, key);

export const removeManyModels = (modelType: string) => (keys: string[]) => crudAction(modelType, CRUDAction.CRUD_REMOVE_MANY, keys);

export const replaceModels = <T, M extends Meta = Meta>(modelType: string) => (values: T[], meta?: M) =>
  crudAction(modelType, CRUDAction.CRUD_REPLACE, values, meta);

export const reorderModels = (modelType: string) => (keyArray: string[]) => crudAction(modelType, CRUDAction.CRUD_REORDER, keyArray);

export const moveModels = (modelType: string) => (from: string | number, to: string | number) =>
  crudAction(modelType, CRUDAction.CRUD_MOVE, { from, to });

export const createCRUDActionCreators = <K extends keyof CRUDStateSubset, T extends NormalizedValue<CRUDStateSubset[K]>>(modelType: K) => ({
  add: addModel<T>(modelType),
  addMany: addManyModels<T>(modelType),
  prepend: prependModel<T>(modelType),
  update: updateModel<T>(modelType),
  patch: patchModel<T>(modelType),
  remove: removeModel(modelType),
  removeMany: removeManyModels(modelType),
  replace: replaceModels<T>(modelType),
  reorder: reorderModels(modelType),
  move: moveModels(modelType),
});
