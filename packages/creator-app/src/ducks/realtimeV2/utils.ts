import produce, { Draft } from 'immer';
import { ActionCreator } from 'typescript-fsa';
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers';

import { createRootSelectorFactory } from '@/ducks/utils';

import type { RealtimeState } from '.';

declare module 'typescript-fsa-reducers' {
  interface ReducerBuilder<InS, OutS = InS, PassedS = InS | undefined> {
    immerCase<P>(actionCreator: ActionCreator<P>, handler: ImmerHandler<InS, P>): ReducerBuilder<InS, OutS, PassedS>;
    immerCases<P>(actionCreator: ActionCreator<P>[], handler: ImmerHandler<InS, P>): ReducerBuilder<InS, OutS, PassedS>;
  }
}

type ImmerHandler<S, P> = (draft: Draft<S>, payload: P) => void;

export const createRootReducer = <T>(initialState: T): ReducerBuilder<T, T, T | undefined> => {
  const reducer = reducerWithInitialState<T>(initialState);

  reducer.immerCase = (actionCreator, handler) => reducer.case(actionCreator, (state, payload) => produce(state, (draft) => handler(draft, payload)));

  reducer.immerCases = (actionCreators, handler) =>
    reducer.cases(actionCreators, (state, payload) => produce(state, (draft) => handler(draft, payload)));

  return reducer;
};

export const createReducerFactory =
  <S>(): {
    <P>(actionCreator: ActionCreator<P>, handler: ImmerHandler<S, P>): [actionCreator: ActionCreator<P>, handler: ImmerHandler<S, P>];
    <P>(actionCreators: ActionCreator<P>[], handler: ImmerHandler<S, P>): [actionCreators: ActionCreator<P>[], handler: ImmerHandler<S, P>];
  } =>
  (actionCreator: ActionCreator<any> | ActionCreator<any>[], handler: ImmerHandler<S, any>) =>
    [actionCreator, handler] as any;

export const createRootSelector = createRootSelectorFactory<RealtimeState>();
