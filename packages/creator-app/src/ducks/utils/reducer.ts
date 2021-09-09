import produce, { Draft } from 'immer';
import { ActionCreator } from 'typescript-fsa';
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers';

import { AnyAction, RootReducer } from '@/store/types';

export type ImmerHandler<S, P> = (draft: Draft<S>, payload: P) => void;

declare module 'typescript-fsa-reducers' {
  interface ReducerBuilder<InS, OutS = InS, PassedS = InS | undefined> {
    immerCase<P>(actionCreator: ActionCreator<P>, handler: ImmerHandler<InS, P>): ReducerBuilder<InS, OutS, PassedS>;
    immerCases<P>(actionCreator: ActionCreator<P>[], handler: ImmerHandler<InS, P>): ReducerBuilder<InS, OutS, PassedS>;
  }
}

export const createLookupReducer =
  <S, A extends AnyAction>(reducer: RootReducer<S, A>) =>
  (state: Record<string, S>, action: A, key?: string) => {
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

export const compositeReducer =
  <S extends Record<string, any>, A extends AnyAction, M extends ReducerMap<Record<string, any>, any>>(
    rootReducer: RootReducer<S, A>,
    reducers: M
  ): RootReducer<S & ReducerMapState<M>, A | ReducerMapAction<M>> =>
  (state, action) =>
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

export const createRootReducer = <T>(initialState: T): ReducerBuilder<T> => {
  const reducer = reducerWithInitialState<T>(initialState);

  reducer.immerCase = (actionCreator, handler) => reducer.case(actionCreator, (state, payload) => produce(state, (draft) => handler(draft, payload)));

  reducer.immerCases = (actionCreators, handler) =>
    reducer.cases(actionCreators, (state, payload) => produce(state, (draft) => handler(draft, payload)));

  return reducer;
};

export interface CreateReducer<S> {
  <P>(actionCreator: ActionCreator<P>, handler: ImmerHandler<S, P>): [actionCreator: ActionCreator<P>, handler: ImmerHandler<S, P>];
  <P>(actionCreators: ActionCreator<P>[], handler: ImmerHandler<S, P>): [actionCreators: ActionCreator<P>[], handler: ImmerHandler<S, P>];
}

export const createReducerFactory =
  <S>(): CreateReducer<S> =>
  (actionCreator: ActionCreator<any> | ActionCreator<any>[], handler: ImmerHandler<S, any>) =>
    [actionCreator, handler] as any;
