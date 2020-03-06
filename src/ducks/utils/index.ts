import moize from 'moize';

import { Action, AnyAction, Reducer, RootReducer } from '@/store/types';

export const createAction = <T extends string, P, M extends object>(type: T, payload?: P, meta?: M) =>
  ({
    type,
    ...(payload !== undefined && { payload }),
    ...(meta && { meta }),
  } as Action<T, P, M>);

export const createRootSelector = <S, K extends string = string>(stateKey: K): ((state: Record<K, S>) => S) =>
  moize(({ [stateKey]: state }) => state);

export const createLookupReducer = <S, A extends AnyAction>(reducer: Reducer<S, A>) => (state: Record<string, S>, action: A, key?: string) => {
  if (!key) {
    return state;
  }

  const currState = state[key!];
  const nextState = reducer(currState, action);

  if (nextState === currState) {
    return state;
  }

  return {
    ...state,
    [key!]: nextState,
  };
};

type ReducerMap<T extends object, A extends AnyAction> = {
  [K in keyof T]: Reducer<T[K], A>;
};

export const compositeReducer = <S extends Record<string, any>, A extends AnyAction>(
  rootReducer: RootReducer<S, A>,
  reducers: ReducerMap<S, A>
): Reducer<S, A> => (state: S, action: A) =>
  Object.keys(reducers).reduce((acc, key) => {
    if (acc && acc[key]) {
      const subState = reducers[key](acc[key], action);
      if (subState !== acc[key]) {
        return {
          ...acc,
          [key]: subState,
        };
      }
    }

    return acc;
  }, rootReducer(state, action));
