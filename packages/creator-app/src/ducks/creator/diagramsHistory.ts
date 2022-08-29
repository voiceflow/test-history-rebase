import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createAction, createKeyedSelector } from '@/ducks/utils';
import { Action, Reducer, RootReducer } from '@/store/types';

import { creatorStateSelector } from './selectors';

export type DiagramsHistoryState = string[];

export const DIAGRAMS_HISTORY_STATE_KEY = 'diagramsHistory';

export const INITIAL_DIAGRAMS_HISTORY_STATE: DiagramsHistoryState = [];

// actions

export enum DiagramsHistoryAction {
  POP = 'CREATOR:DIAGRAMS_HISTORY:POP',
  PUSH = 'CREATOR:DIAGRAMS_HISTORY:PUSH',
  CLEAR = 'CREATOR:DIAGRAMS_HISTORY:CLEAR',
}

export type DiagramsHistoryPop = Action<DiagramsHistoryAction.POP>;

export type DiagramsHistoryPush = Action<DiagramsHistoryAction.PUSH, { diagramID: string }>;

export type DiagramsHistoryClear = Action<DiagramsHistoryAction.CLEAR>;

type AnyDiagramsHistoryAction = DiagramsHistoryPop | DiagramsHistoryPush | DiagramsHistoryClear;

// reducers

export const diagramsHistoryPopReducer: Reducer<DiagramsHistoryState, DiagramsHistoryPop> = (state, _action) => state.slice(0, state.length - 1);

export const diagramsHistoryPushReducer: Reducer<DiagramsHistoryState, DiagramsHistoryPush> = (state, { payload: { diagramID } }) => [
  ...state,
  diagramID,
];

const diagramsHistoryReducer: RootReducer<DiagramsHistoryState, AnyDiagramsHistoryAction> = (state = INITIAL_DIAGRAMS_HISTORY_STATE, action) => {
  switch (action.type) {
    case Realtime.creator.reset.type:
    case DiagramsHistoryAction.CLEAR:
      return INITIAL_DIAGRAMS_HISTORY_STATE;
    case DiagramsHistoryAction.POP:
      return diagramsHistoryPopReducer(state, action);
    case DiagramsHistoryAction.PUSH:
      return diagramsHistoryPushReducer(state, action);
    default:
      return state;
  }
};

export default diagramsHistoryReducer;

// selectors

const rootSelector = createKeyedSelector(creatorStateSelector, DIAGRAMS_HISTORY_STATE_KEY);

export { rootSelector as creatorDiagramsHistorySelector };

export const previousDiagramIDSelector = createSelector(
  [rootSelector],
  (diagramsHistory): string | null => diagramsHistory[diagramsHistory.length - 2] ?? null
);

// action creators

export const diagramsHistoryPop = (): DiagramsHistoryPop => createAction(DiagramsHistoryAction.POP);

export const diagramsHistoryPush = (diagramID: string): DiagramsHistoryPush => createAction(DiagramsHistoryAction.PUSH, { diagramID });

export const diagramsHistoryClear = (): DiagramsHistoryClear => createAction(DiagramsHistoryAction.CLEAR);
