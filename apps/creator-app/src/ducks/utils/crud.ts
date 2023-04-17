import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';
import { PickByValue } from 'utility-types';

import type { State } from '@/ducks';
import { Action, RootReducer, Selector } from '@/store/types';

import { createAction, createRootSelector } from '.';

export type CRUDState<T> = Normal.Normalized<T>;

type CRUDStateSubset = PickByValue<State, CRUDState<any>>;

export interface Meta {
  modelType?: string;
  receivedAction?: boolean;
}

export const createCRUDState: () => CRUDState<any> = Normal.createEmpty;

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

export const crudReorderReducer = <T, S extends CRUDState<T> = CRUDState<T>>(store: S, { payload }: CRUDReorder): S => Normal.reorder(store, payload);

export const crudAddReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: { key, value } }: CRUDAdd<T>) =>
  Utils.normalized.addNormalizedByKey(state, key, value);

export const crudAddManyReducer = <T, K extends Utils.normalized.GetKey<T> = (obj: T) => string, S extends CRUDState<T> = CRUDState<T>>(
  state: S,
  { payload: values }: CRUDAddMany<T>,
  getKey: K
) => Utils.normalized.addAllNormalizedByKeys(state, values, getKey);

export const crudPrependReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: { key, value } }: CRUDPrepend<T>) =>
  Utils.normalized.addToStartNormalizedByKey(state, key, value);

export const crudUpdateReducer = <T, S extends CRUDState<T> = CRUDState<T>>(
  state: S,
  { payload: { key, value, patch } }: CRUDPatch<T> | CRUDUpdate<T>
): S => Utils.normalized.updateNormalizedByKey(state, key, patch ? { ...Utils.normalized.getNormalizedByKey(state, key), ...value } : value);

export const crudRemoveReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: key }: CRUDRemove): S =>
  Normal.removeOne(state, key);

export const crudRemoveManyReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: keys }: CRUDRemoveMany): S =>
  Normal.removeMany(state, keys);

export const crudReplaceReducer = <T, K extends Normal.GetKey<T> = (obj: T) => string>(
  { payload: values }: CRUDReplace<T>,
  getKey: K
): Normal.Normalized<T> => Normal.normalize(values, getKey);

export const crudMoveReducer = <T, S extends CRUDState<T> = CRUDState<T>>(state: S, { payload: { from, to } }: CRUDMove) => {
  if (from === to) return state;

  const reordered = Utils.array.reorder(
    state.allKeys,
    typeof from === 'number' ? from : state.allKeys.indexOf(from),
    typeof to === 'number' ? to : state.allKeys.indexOf(to)
  );

  return Utils.normalized.reorderKeys(reordered, state.byKey);
};

const createCRUDReducer: {
  <T extends Normal.Identifiable, G extends Utils.normalized.GetKey<T> = (obj: T) => string, S extends CRUDState<T> = CRUDState<T>>(
    modelType: string,
    getKey?: G
  ): RootReducer<S, AnyCRUDAction<T>>;
  // must provide getKey if object does not extend ObjectWithId
  <T, K extends Utils.normalized.GetKey<T> = (obj: T) => string, S extends CRUDState<T> = CRUDState<T>>(modelType: string, getKey: K): RootReducer<
    S,
    AnyCRUDAction<T>
  >;
} = (modelType: string, getKey?: (obj: any) => string) => {
  const initialState = createCRUDState();

  return (state = initialState, action: AnyCRUDAction<any>) => {
    const keyGetter = getKey ?? Utils.normalized.defaultGetKey;

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
};

export default createCRUDReducer;

// selectors

export const createCRUDSelectors = <K extends keyof CRUDStateSubset, S extends CRUDStateSubset[K], T extends Normal.NormalizedValue<S>>(
  modelType: K
) => {
  const root = createRootSelector<any>(modelType) as Selector<CRUDState<T> & S>;
  const all = createSelector([root], Normal.denormalize as any) as Selector<T[]>;
  const count = createSelector([root], ({ allKeys }) => allKeys.length);
  const collect = createSelector(
    [root],
    (models) =>
      <R>(collector: (state: S) => R) =>
        collector(models)
  );
  const map = createSelector([root], ({ byKey }): Record<string, T> => byKey);
  const allIDs = createSelector([root], ({ allKeys }): string[] => allKeys);

  return {
    root: root as Selector<S>,
    all,
    map,
    allIDs,
    findByIDs: createSelector(
      [collect],
      (findModels) => (ids: string[]) =>
        findModels((normalized) =>
          ids.reduce<T[]>((acc, id) => {
            if (normalized.allKeys.includes(id)) {
              acc.push(Utils.normalized.getNormalizedByKey(normalized as CRUDState<any>, id));
            }

            return acc;
          }, [])
        )
    ),
    byID: createSelector([root], (normalized: CRUDState<T>) => (id: string) => Utils.normalized.getNormalizedByKey(normalized, id)),
    count,
    isEmpty: createSelector([count], (size) => size === 0),
  };
};

// action creators

export const crudAction = <T extends CRUDAction, P, M extends Meta = Meta>(modelType: string, type: T, payload: P, meta?: M) =>
  createAction(type, payload, { modelType, ...meta });

export const addModel =
  <T>(modelType: string) =>
  (key: string, value: T): CRUDAdd<T> =>
    crudAction(modelType, CRUDAction.CRUD_ADD, { key, value });

export const addManyModels =
  <T>(modelType: string) =>
  (values: T[]): CRUDAddMany<T> =>
    crudAction(modelType, CRUDAction.CRUD_ADD_MANY, values);

export const prependModel =
  <T>(modelType: string) =>
  (key: string, value: T): CRUDPrepend<T> =>
    crudAction(modelType, CRUDAction.CRUD_PREPEND, { key, value });

export const updateModel =
  <T, M extends Meta = Meta>(
    modelType: string
  ): {
    (key: string, value: Partial<T>, patch: true, meta?: M): CRUDPatch<T>;
    (key: string, value: T, patch?: false, meta?: M): CRUDUpdate<T>;
  } =>
  (key: string, value: any, patch = false, meta?: M) =>
    crudAction(modelType, CRUDAction.CRUD_UPDATE, { key, value, patch: patch as any }, meta);

export const patchModel =
  <T, M extends Meta = Meta>(modelType: string) =>
  (key: string, value: Partial<T>, meta?: M): CRUDPatch<T> =>
    crudAction(modelType, CRUDAction.CRUD_UPDATE, { key, value, patch: true }, meta);

export const removeModel =
  (modelType: string) =>
  (key: string): CRUDRemove =>
    crudAction(modelType, CRUDAction.CRUD_REMOVE, key);

export const removeManyModels =
  (modelType: string) =>
  (keys: string[]): CRUDRemoveMany =>
    crudAction(modelType, CRUDAction.CRUD_REMOVE_MANY, keys);

export const replaceModels =
  <T, M extends Meta = Meta>(modelType: string) =>
  (values: T[], meta?: M): CRUDReplace<T> =>
    crudAction(modelType, CRUDAction.CRUD_REPLACE, values, meta);

export const reorderModels = (modelType: string) => (keyArray: string[]) => crudAction(modelType, CRUDAction.CRUD_REORDER, keyArray);

export const moveModels = (modelType: string) => (from: string | number, to: string | number) =>
  crudAction(modelType, CRUDAction.CRUD_MOVE, { from, to });

export const createCRUDActionCreators = <K extends keyof CRUDStateSubset, T extends Normal.NormalizedValue<CRUDStateSubset[K]>>(modelType: K) => ({
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
