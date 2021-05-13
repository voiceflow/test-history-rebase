import moize from 'moize';

import type { State } from '@/ducks';
import { Action, AnyAction, RootReducer, Selector } from '@/store/types';
import { storeLogger } from '@/store/utils';

export const duckLogger = storeLogger.child('duck');

export const createAction = <T extends string, P, M extends object | void>(type: T, payload?: P, meta?: M) =>
  ({
    type,
    ...(payload !== undefined && { payload }),
    ...(meta && { meta }),
  } as Action<T, P, Exclude<M, void>>);

export const createKeyedSelector = <S extends Selector<any>, K extends keyof ReturnType<S>>(
  selector: S,
  stateKey: K
): ((state: State) => ReturnType<S>[K]) => moize((state) => selector(state)[stateKey]);

export const createRootSelector = <K extends keyof State>(stateKey: K): ((state: State) => State[K]) => moize(({ [stateKey]: state }) => state);

export const createLookupReducer = <S, A extends AnyAction>(reducer: RootReducer<S, A>) => (state: Record<string, S>, action: A, key?: string) => {
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

type ReducerMap<T extends Record<string, any>, A> = {
  [K in keyof T]: RootReducer<T[K], A>;
};

type ReducerMapState<T> = T extends ReducerMap<infer R, any> ? R : never;
type ReducerMapAction<T> = T extends ReducerMap<any, infer R> ? R : never;

export const compositeReducer = <S extends Record<string, any>, A extends AnyAction, M extends ReducerMap<Record<string, any>, any>>(
  rootReducer: RootReducer<S, A>,
  reducers: M
): RootReducer<S & ReducerMapState<M>, A | ReducerMapAction<M>> => (state, action) =>
  Object.keys(reducers).reduce((acc, key) => {
    if (acc) {
      const subState = reducers[key]!(acc[key], action as ReducerMapAction<M>);
      if (subState !== acc[key]) {
        return {
          ...acc,
          [key]: subState,
        };
      }
    }

    return acc;
  }, rootReducer(state, action as A) as S & ReducerMapState<M>);
