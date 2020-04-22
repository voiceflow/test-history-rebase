import moize from 'moize';

import type { State } from '@/ducks/_root';
import { Action, AnyAction, Reducer, RootReducer, Selector } from '@/store/types';

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

type ReducerMap<T extends object, A extends AnyAction> = {
  [K in keyof T]: Reducer<T[K], A>;
};

export const compositeReducer = <S extends Record<string, any>, A extends AnyAction>(rootReducer: RootReducer<S, A>, reducers: ReducerMap<S, A>) => (
  state: S,
  action: A
) =>
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
