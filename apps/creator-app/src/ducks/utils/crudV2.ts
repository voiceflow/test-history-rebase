/* eslint-disable no-param-reassign */

import type { NormalizedValue } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import type { Draft } from 'immer';
import * as Normal from 'normal-store';
import type { ParametricSelector, Selector } from 'reselect';
import { createSelector } from 'reselect';
import type { ReducerBuilder } from 'typescript-fsa-reducers';
import type { PickByValue } from 'utility-types';

import type { State } from '@/ducks';

import type { CreateReducer, ImmerHandler } from './reducer';
import { createRootReducer } from './reducer';
import { createParameterSelector, createRootSelector } from './selector';

export type CRUDState<T> = Normal.Normalized<T>;

export const createCRUDState: () => CRUDState<any> = Normal.createEmpty;

export interface IDSelectorParam {
  id: string | undefined | null;
}

export interface IDsSelectorParam {
  ids: string[];
}

// reducers

type CRUDReducers<
  Model extends Normal.Identifiable,
  State extends CRUDState<Model>,
  Actions extends Realtime.actionUtils.CRUDActionCreators<Model, any, any>,
> = {
  [K in Exclude<keyof Actions, 'refresh'>]: [actionCreator: Actions[K], handler: ImmerHandler<State, any>];
};

export const createCRUDReducers = <
  Model extends Normal.Identifiable,
  State extends CRUDState<Model>,
  Context extends object = {},
  Patch extends Partial<Model> = Partial<Model>,
>(
  createReducer: CreateReducer<State>,
  actionCreators: Realtime.actionUtils.CRUDActionCreators<Model, Context, Patch>
): Omit<CRUDReducers<Model, State, Realtime.actionUtils.CRUDActionCreators<Model, Context, Patch>>, 'refresh'> => {
  const add = createReducer(actionCreators.add, (state, { key, value }) => {
    state.byKey[key] = value as Draft<Model>;

    if (!state.allKeys.includes(key)) {
      state.allKeys.push(key);
    }
  });

  const addMany = createReducer(actionCreators.addMany, (state, { values }) => {
    state.allKeys = Utils.array.unique([...state.allKeys, ...values.map(Utils.normalized.defaultGetKey)]);

    values.forEach((value) => {
      state.byKey[Utils.normalized.defaultGetKey(value)] = value as Draft<Model>;
    });
  });

  const prepend = createReducer(actionCreators.prepend, (state, { key, value }) => {
    state.byKey[key] = value as Draft<Model>;

    state.allKeys.unshift(key);
  });

  const update = createReducer(actionCreators.update, (state, { key, value }) => {
    state.byKey[key] = value as Draft<Model>;
  });

  const patch = createReducer(actionCreators.patch, (state, { key, value }) => {
    const currValue = Normal.getOne(state, key);

    if (currValue) {
      Object.assign(currValue, value);
    }
  });

  const remove = createReducer(actionCreators.remove, (state, { key }) => {
    state.allKeys = state.allKeys.filter((_key) => _key !== key);

    delete state.byKey[key];
  });

  const removeMany = createReducer(actionCreators.removeMany, (state, { keys }) => {
    state.allKeys = state.allKeys.filter((key) => !keys.includes(key));

    keys.forEach((key) => {
      delete state.byKey[key];
    });
  });

  const replace = createReducer(actionCreators.replace, (state, payload, action) => {
    state.byKey = {};
    state.allKeys = [];

    addMany[1](state, payload, action);
  });

  const reorder = createReducer(actionCreators.reorder, (state, { keys }) => {
    state.allKeys = keys;
  });

  const move = createReducer(actionCreators.move, (state, { toIndex, fromID }) => {
    const fromIndex = state.allKeys.indexOf(fromID);

    state.allKeys = Utils.array.reorder(state.allKeys, fromIndex, toIndex);
  });

  return {
    add,
    addMany,
    prepend,
    update,
    patch,
    remove,
    removeMany,
    replace,
    reorder,
    move,
  };
};

export const createRootCRUDReducer = <Model extends Normal.Identifiable, State extends CRUDState<Model>>(
  initialState: State,
  crudReducers: Omit<CRUDReducers<Model, State, Realtime.actionUtils.CRUDActionCreators<Model, any, any>>, 'refresh'>
): ReducerBuilder<State> => {
  const rootReducer = createRootReducer(initialState);

  Object.values(crudReducers).forEach((reducer) => rootReducer.immerCase(...reducer));

  return rootReducer;
};

// selectors
type CRUDStateSubset = PickByValue<State, CRUDState<any>>;

interface CRUDSelectors<K extends keyof CRUDStateSubset> {
  isEmpty: Selector<State, boolean>;
  count: Selector<State, number>;
  all: Selector<State, NormalizedValue<CRUDStateSubset[K]>[]>;
  map: Selector<State, Record<string, NormalizedValue<CRUDStateSubset[K]>>>;
  root: Selector<State, CRUDStateSubset[K]>;
  hasByID: ParametricSelector<State, IDSelectorParam, boolean>;
  hasByIDs: ParametricSelector<State, IDsSelectorParam, boolean>;
  byID: ParametricSelector<State, IDSelectorParam, NormalizedValue<CRUDStateSubset[K]> | null>;
  byIDs: ParametricSelector<State, IDsSelectorParam, NormalizedValue<CRUDStateSubset[K]>[]>;
  allIDs: Selector<State, string[]>;
  getByID: Selector<State, (params: IDSelectorParam) => NormalizedValue<CRUDStateSubset[K]> | null>;
  getByIDs: Selector<State, (params: IDsSelectorParam) => NormalizedValue<CRUDStateSubset[K]>[]>;
  withoutIDs: ParametricSelector<State, IDsSelectorParam, NormalizedValue<CRUDStateSubset[K]>[]>;
}

export const idParamSelector = createParameterSelector((params: IDSelectorParam) => params.id);
export const idsParamSelector = createParameterSelector((params: IDsSelectorParam) => params.ids);

export const createCRUDSelectors = <K extends keyof CRUDStateSubset, T extends NormalizedValue<CRUDStateSubset[K]>>(
  modelType: K
): CRUDSelectors<K> => {
  const root = createRootSelector(modelType) as Selector<State, CRUDStateSubset[K]>;
  const map = createSelector([root], ({ byKey }) => byKey as Record<string, T>);
  const allIDs = createSelector([root], ({ allKeys }) => allKeys);
  const pureNormalized = createSelector([map, allIDs], (byKey, allKeys) => ({
    byKey,
    allKeys,
  }));

  const count = createSelector([allIDs], (allKeys) => allKeys.length);
  const isEmpty = createSelector([count], (size) => size === 0);
  const all = createSelector([pureNormalized], (xs) => Normal.denormalize(xs as CRUDState<T>));

  const hasByID = createSelector([pureNormalized, idParamSelector], (normalized, id) =>
    id ? Normal.hasOne(normalized, id) : false
  );
  const hasByIDs = createSelector([pureNormalized, idsParamSelector], (normalized, ids) =>
    Normal.hasMany(normalized, ids)
  );

  const byID = createSelector([pureNormalized, idParamSelector], (normalized, id) =>
    id ? Normal.getOne(normalized, id) : null
  );
  const byIDs = createSelector([pureNormalized, idsParamSelector], (normalized, ids) =>
    Normal.getMany(normalized, ids)
  );
  const getByID = createSelector(
    [pureNormalized],
    (normalized) =>
      ({ id }: IDSelectorParam) =>
        id ? Normal.getOne(normalized, id) : null
  );
  const getByIDs = createSelector(
    [pureNormalized],
    (normalized) =>
      ({ ids }: IDsSelectorParam) =>
        Normal.getMany(normalized, ids)
  );

  const withoutIDs = createSelector([all, idsParamSelector], (items, ids) =>
    items.filter((item) => {
      const itemID = item.id.toString();
      return !ids.includes(itemID);
    })
  );

  return {
    isEmpty,
    count,
    all,
    map,
    root,
    hasByID,
    hasByIDs,
    byID,
    byIDs,
    getByID,
    getByIDs,
    allIDs,
    withoutIDs,
  };
};
