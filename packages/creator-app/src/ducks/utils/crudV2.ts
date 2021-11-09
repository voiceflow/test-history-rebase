/* eslint-disable no-param-reassign */

import { NormalizedValue, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import { ReducerBuilder } from 'typescript-fsa-reducers';
import { PickByValue } from 'utility-types';

import type { State } from '..';
import { CRUDState } from './crud';
import { CreateReducer, createRootReducer, ImmerHandler } from './reducer';
import { createParameterSelector, createRootSelector } from './selector';

export type { CRUDState } from './crud';
export { createCRUDState } from './crud';

export interface IDSelectorParam {
  id: string | undefined | null;
}

export interface IDsSelectorParam {
  ids: string[];
}

// reducers

type CRUDReducers<T extends Realtime.actionUtils.CRUDActionCreators<any, any, any>> = {
  [K in Exclude<keyof T, 'refresh'>]: [actionCreator: T[K], handler: ImmerHandler<CRUDState<any>, any>];
};

export const createCRUDReducers = <T, D extends Utils.normalized.ObjectWithId, P extends Partial<D> = Partial<D>>(
  createReducer: CreateReducer<CRUDState<any>>,
  actionCreators: Realtime.actionUtils.CRUDActionCreators<T, D, P>
): Omit<CRUDReducers<Realtime.actionUtils.CRUDActionCreators<T, D, P>>, 'refresh'> => {
  const add = createReducer(actionCreators.add, (state, { key, value }) => {
    state.byKey[key] = value;

    if (!state.allKeys.includes(key)) {
      state.allKeys.push(key);
    }
  });

  const addMany = createReducer(actionCreators.addMany, (state, { values }) => {
    state.allKeys = Utils.array.unique([...state.allKeys, ...values.map(Utils.normalized.defaultGetKey)]);

    values.forEach((value) => {
      state.byKey[Utils.normalized.defaultGetKey(value)] = value;
    });
  });

  const prepend = createReducer(actionCreators.prepend, (state, { key, value }) => {
    state.byKey[key] = value;

    state.allKeys.unshift(key);
  });

  const update = createReducer(actionCreators.update, (state, { key, value }) => {
    state.byKey[key] = value;
  });

  const patch = createReducer(actionCreators.patch, (state, { key, value }) => {
    const currValue = Utils.normalized.safeGetNormalizedByKey(state, key);

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

  const replace = createReducer(actionCreators.replace, (state, payload) => {
    state.byKey = {};
    state.allKeys = [];

    addMany[1](state, payload);
  });

  const reorder = createReducer(actionCreators.reorder, (state, { keys }) => {
    state.allKeys = keys;
  });

  const move = createReducer(actionCreators.move, (state, { from, to }) => {
    if (from !== to) {
      state.allKeys = Utils.array.reorder(
        state.allKeys,
        typeof from === 'number' ? from : state.allKeys.indexOf(from),
        typeof to === 'number' ? to : state.allKeys.indexOf(to)
      );
    }
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

export const createRootCRUDReducer = <T extends CRUDState<any>>(
  initialState: T,
  crudReducers: Omit<CRUDReducers<Realtime.actionUtils.CRUDActionCreators<any, any, any>>, 'refresh'>
): ReducerBuilder<T> => {
  const rootReducer = createRootReducer(initialState);

  Object.values(crudReducers).forEach((reducer) => rootReducer.immerCase(...reducer));

  return rootReducer;
};

// selectors
type CRUDStateSubset = PickByValue<State, CRUDState<any>>;

interface CRUDSelectors<K extends keyof CRUDStateSubset> {
  has: Selector<State, boolean>;
  count: Selector<State, number>;
  all: Selector<State, NormalizedValue<CRUDStateSubset[K]>[]>;
  map: Selector<State, Record<string, NormalizedValue<CRUDStateSubset[K]>>>;
  root: Selector<State, CRUDStateSubset[K]>;
  byID: ParametricSelector<State, IDSelectorParam, NormalizedValue<CRUDStateSubset[K]> | null>;
  byIDs: ParametricSelector<State, IDsSelectorParam, NormalizedValue<CRUDStateSubset[K]>[]>;
  allIDs: Selector<State, string[]>;
  getByID: Selector<State, (id: string) => NormalizedValue<CRUDStateSubset[K]> | null>;
  getByIDs: Selector<State, (ids: string[]) => NormalizedValue<CRUDStateSubset[K]>[]>;
}

export const idParamSelector = createParameterSelector<IDSelectorParam>((params) => params.id);
export const idsParamSelector = createParameterSelector<IDsSelectorParam>((params) => params.ids);

export const createCRUDSelectors = <K extends keyof CRUDStateSubset, T extends NormalizedValue<CRUDStateSubset[K]>>(
  modelType: K
): CRUDSelectors<K> => {
  const root = createRootSelector(modelType) as Selector<State, CRUDStateSubset[K]>;
  const count = createSelector([root], ({ allKeys }) => allKeys.length);
  const has = createSelector([count], (size) => size !== 0);
  const all = createSelector([root], (xs) => Utils.normalized.denormalize(xs as CRUDState<T>));
  const map = createSelector([root], ({ byKey }) => byKey as Record<string, T>);
  const allIDs = createSelector([root], ({ allKeys }) => allKeys);

  const byIDGetter = (normalized: CRUDState<any>, id: string | null | undefined): T | null =>
    id ? Utils.normalized.safeGetNormalizedByKey<T>(normalized, id) : null;
  const byIDsGetter = (normalized: CRUDState<any>, ids: string[]): T[] =>
    ids.reduce<any[]>((acc, id) => {
      const value = byIDGetter(normalized, id);

      return value ? [...acc, value] : acc;
    }, []);

  const byID = createSelector([root, idParamSelector], (normalized, id) => byIDGetter(normalized, id));
  const byIDs = createSelector([root, idsParamSelector], (normalized, ids) => byIDsGetter(normalized, ids));
  const getByID = createSelector([root], (normalized) => (id: string) => byIDGetter(normalized, id));
  const getByIDs = createSelector([root], (normalized) => (ids: string[]) => byIDsGetter(normalized, ids));

  return {
    has,
    count,
    all,
    map,
    root,
    byID,
    byIDs,
    allIDs,
    getByID,
    getByIDs,
  };
};
