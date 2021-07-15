/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionCreator } from 'typescript-fsa';

import { withoutValue } from '@/utils/array';
import { createEmptyNormalized } from '@/utils/normalized';

import { createReducerFactory } from '../../utils';
import { RealtimeDiagramAwarenessState, RealtimeDiagramState } from '../types';

const createReducer = createReducerFactory<RealtimeDiagramState>();

export const moveCursorReducer = createReducer(Realtime.diagram.moveCursor, (state, { diagramID, tabID, coords }) => {
  const diagramState = state[diagramID] || (state[diagramID] = { awareness: createEmptyNormalized() });

  if (!diagramState.awareness.allKeys.includes(tabID)) {
    diagramState.awareness.allKeys.push(tabID);
  }

  diagramState.awareness.byKey[tabID] = coords;
});

export const hideCursorReducer = createReducer(
  [Realtime.diagram.hideCursor, Realtime.project.forgetViewer] as ActionCreator<{ projectID?: string; tabID: string }>[],
  (state, { projectID, tabID }) => {
    const removeFromAwareness = (awareness: RealtimeDiagramAwarenessState) => {
      awareness.allKeys = withoutValue(awareness.allKeys, tabID);
      delete awareness.byKey[tabID];
    };

    if (projectID) {
      const projectState = state[projectID];

      if (projectState) {
        removeFromAwareness(projectState.awareness);
      }
    } else {
      Object.values(state).forEach((projectState) => {
        removeFromAwareness(projectState.awareness);
      });
    }
  }
);
