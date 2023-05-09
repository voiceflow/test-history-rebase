import { Utils } from '@voiceflow/common';
import { Draft, produce } from 'immer';
import { Action, ActionCreator } from 'typescript-fsa';
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers';

import { IS_E2E, IS_PRODUCTION } from '@/config';
import { AnyAction, RootReducer } from '@/store/types';

export type ImmerHandler<State, Payload> = (draft: Draft<State>, payload: Payload, action: Action<Payload>) => Draft<State> | void;

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
  const actions = new Set<string>();

  const registerActions = (actionCreators: ActionCreator<any>[]) => {
    if (IS_PRODUCTION && !IS_E2E) return;

    actionCreators.forEach((actionCreator) => {
      if (actions.has(actionCreator.type)) {
        throw new Error(
          `The reducer for "${actionCreator.type}" action is already registered. Please use 'createCombinedReducer' to register multiple reducers for a single action.`
        );
      }

      actions.add(actionCreator.type);
    });
  };

  reducer.immerCase = (actionCreator, handler) => {
    registerActions([actionCreator]);

    return reducer.caseWithAction(actionCreator, (state, action) => produce(state, (draft) => handler(draft, action.payload, action)));
  };

  reducer.immerCases = (actionCreators, handler) => {
    registerActions(actionCreators);

    return reducer.casesWithAction(actionCreators, (state, action) => produce(state, (draft) => handler(draft, action.payload, action)));
  };

  return reducer;
};

export interface CreateSimpleReducer<State, BasePayload = any> {
  <Payload extends BasePayload>(actionCreator: ActionCreator<Payload>, handler: ImmerHandler<State, Payload>): [
    actionCreator: ActionCreator<Payload>,
    handler: ImmerHandler<State, Payload>
  ];
}

export interface CreateReducer<State, BasePayload = any> extends CreateSimpleReducer<State, BasePayload> {
  <Payload extends BasePayload>(actionCreators: ActionCreator<Payload>[], handler: ImmerHandler<State, Payload>): [
    actionCreators: ActionCreator<Payload>[],
    handler: ImmerHandler<State, Payload>
  ];
}

export interface CreateCombinedReducer<State, BasePayload = any> {
  <Payload extends BasePayload>(...reducers: Array<[actionCreator: ActionCreator<Payload>, handler: ImmerHandler<State, Payload>]>): [
    actionCreator: ActionCreator<Payload>,
    handler: ImmerHandler<State, Payload>
  ];
}

export const createReducerFactory =
  <State>(): CreateReducer<State> =>
  (actionCreator, handler) =>
    [actionCreator, handler] as any;

const validateCombinedActions = <State>(reducers: Array<[actionCreator: ActionCreator<any>, handler: ImmerHandler<State, any>]>) => {
  if (IS_PRODUCTION && !IS_E2E) return reducers[0][0];

  if (Utils.array.unique(reducers.map(([actionCreator]) => actionCreator.type)).length !== 1) {
    throw new Error(`The reducers must have "${reducers[0][0].type}" action type.`);
  }

  return reducers[0][0];
};

export const createCombinedReducerFactory =
  <State>(): CreateCombinedReducer<State> =>
  (...reducers) =>
    [
      validateCombinedActions(reducers),
      (state, payload, action) =>
        reducers.reduceRight((draft, [_, handler]) => handler(draft === undefined ? state : draft, payload, action) as any, state),
    ];
