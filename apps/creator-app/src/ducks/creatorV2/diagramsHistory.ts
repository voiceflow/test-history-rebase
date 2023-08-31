import * as Realtime from '@voiceflow/realtime-sdk';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { createSelector } from 'reselect';

import { createAction, createKeyedSelector } from '@/ducks/utils';
import { Action, Reducer, RootReducer } from '@/store/types';

import { creatorStateSelector } from './selectors/base';

export type DiagramsHistoryState = { diagramID: string; nodeID?: string }[];

export const DIAGRAMS_HISTORY_STATE_KEY = 'diagramsHistory';

export const INITIAL_DIAGRAMS_HISTORY_STATE: DiagramsHistoryState = [];

// actions

export enum DiagramsHistoryAction {
  POP = 'CREATOR:DIAGRAMS_HISTORY:POP',
  PUSH = 'CREATOR:DIAGRAMS_HISTORY:PUSH',
  CLEAR = 'CREATOR:DIAGRAMS_HISTORY:CLEAR',
}

export type DiagramsHistoryPop = Action<DiagramsHistoryAction.POP>;

export type DiagramsHistoryPush = Action<DiagramsHistoryAction.PUSH, { diagramID: string; nodeID?: string }>;

export type DiagramsHistoryClear = Action<DiagramsHistoryAction.CLEAR>;

type AnyDiagramsHistoryAction = DiagramsHistoryPop | DiagramsHistoryPush | DiagramsHistoryClear;

// reducers

export const diagramsHistoryPopReducer: Reducer<DiagramsHistoryState, DiagramsHistoryPop> = (state, _action) => state.slice(0, state.length - 1);

export const diagramsHistoryPushReducer: Reducer<DiagramsHistoryState, DiagramsHistoryPush> = (state, { payload: { diagramID, nodeID } }) => [
  ...state,
  { diagramID, nodeID },
];

const diagramsHistoryReducer: RootReducer<DiagramsHistoryState, AnyDiagramsHistoryAction | LocationChangeAction> = (
  state = INITIAL_DIAGRAMS_HISTORY_STATE,
  action
) => {
  // If user navigates using browser controls, we should clear the history
  if (action.type === LOCATION_CHANGE && action.payload.action === 'POP') {
    return INITIAL_DIAGRAMS_HISTORY_STATE;
  }

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

export const previousDiagramHistoryStateSelector = createSelector(
  [rootSelector],
  (diagramsHistory): { diagramID: string; nodeID?: string } | null => diagramsHistory[diagramsHistory.length - 1] ?? null
);

// action creators

export const diagramsHistoryPop = (): DiagramsHistoryPop => createAction(DiagramsHistoryAction.POP);

export const diagramsHistoryPush = (diagramID: string, nodeID?: string): DiagramsHistoryPush =>
  createAction(DiagramsHistoryAction.PUSH, { diagramID, nodeID });

export const diagramsHistoryClear = (): DiagramsHistoryClear => createAction(DiagramsHistoryAction.CLEAR);
