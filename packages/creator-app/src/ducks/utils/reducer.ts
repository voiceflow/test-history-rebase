import produce, { Draft } from 'immer';
import { ActionCreator } from 'typescript-fsa';
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers';

import { AnyAction, RootReducer } from '@/store/types';

export type ImmerHandler<State, Payload> = (draft: Draft<State>, payload: Payload) => Draft<State> | void;

declare module 'typescript-fsa-reducers' {
  interface ReducerBuilder<InS, OutS = InS, PassedS = InS | undefined> {
    immerCase<P>(actionCreator: ActionCreator<P>, handler: ImmerHandler<InS, P>): ReducerBuilder<InS, OutS, PassedS>;
    immerCases<P>(actionCreator: ActionCreator<P>[], handler: ImmerHandler<InS, P>): ReducerBuilder<InS, OutS, PassedS>;
  }
}

export const createLookupReducer =
  <State, Action extends AnyAction>(reducer: RootReducer<State, Action>) =>
  (state: Record<string, State>, action: Action, key?: string) => {
    if (!key) return state;

    const currState = state[key];
    const nextState = reducer(currState, action);

    if (nextState === currState) return state;

    return { ...state, [key]: nextState };
  };

export const createRootReducer = <State>(initialState: State): ReducerBuilder<State> => {
  const reducer = reducerWithInitialState<State>(initialState);

  reducer.immerCase = (actionCreator, handler) => reducer.case(actionCreator, (state, payload) => produce(state, (draft) => handler(draft, payload)));

  reducer.immerCases = (actionCreators, handler) =>
    reducer.cases(actionCreators, (state, payload) => produce(state, (draft) => handler(draft, payload)));

  return reducer;
};

export interface CreateReducer<State, BasePayload = any> {
  <Payload extends BasePayload>(actionCreator: ActionCreator<Payload>, handler: ImmerHandler<State, Payload>): [
    actionCreator: ActionCreator<Payload>,
    handler: ImmerHandler<State, Payload>
  ];
  <Payload extends BasePayload>(actionCreators: ActionCreator<Payload>[], handler: ImmerHandler<State, Payload>): [
    actionCreators: ActionCreator<Payload>[],
    handler: ImmerHandler<State, Payload>
  ];
}

export const createReducerFactory =
  <State>(): CreateReducer<State> =>
  (actionCreator: ActionCreator<any> | ActionCreator<any>[], handler: ImmerHandler<State, any>) =>
    [actionCreator, handler] as any;
