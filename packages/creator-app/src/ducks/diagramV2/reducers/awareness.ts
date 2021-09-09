/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';
import { Draft } from 'immer';

import { createReducerFactory } from '@/ducks/utils';

import { RealtimeDiagramAwarenessState, RealtimeDiagramState } from '../types';

const createReducer = createReducerFactory<RealtimeDiagramState>();

const initializeAwareness = <T extends Draft<RealtimeDiagramAwarenessState['cursors']> | Draft<RealtimeDiagramAwarenessState['viewers']>>(
  state: T,
  diagramID: string
): T[string] => {
  if (!state[diagramID]) {
    state[diagramID] = {};
  }

  return state[diagramID] as T[string];
};

const createViewer = (viewer: Realtime.Viewer) => ({ ...viewer, color: getAlternativeColor(viewer.creatorID), creator_id: viewer.creatorID });

export const moveCursorReducer = createReducer(Realtime.diagram.awarenessMoveCursor, (state, { diagramID, creatorID, coords }) => {
  const awarenessCursors = initializeAwareness(state.awareness.cursors, diagramID);

  awarenessCursors[creatorID] = coords;
});

export const hideCursorReducer = createReducer(Realtime.diagram.awarenessHideCursor, (state, { creatorID, diagramID }) => {
  const awarenessCursors = initializeAwareness(state.awareness.cursors, diagramID);

  delete awarenessCursors[creatorID];
});

export const updateDiagramViewers = createReducer(Realtime.project.awarenessUpdateViewers, (state, { diagramID, viewers }) => {
  initializeAwareness(state.awareness.viewers, diagramID);

  state.awareness.viewers[diagramID] = viewers.map(createViewer);

  if (state.awareness.cursors[diagramID]) {
    Object.keys(state.awareness.cursors[diagramID]).forEach((creatorID) => {
      if (!viewers.some((viewer) => String(viewer.creatorID) === creatorID)) {
        delete state.awareness.cursors[diagramID][creatorID];
      }
    });
  }
});

export const loadViewersReducer = createReducer(Realtime.project.awarenessLoadViewers, (state, { viewers }) => {
  Object.keys(viewers).forEach((diagramID) => {
    initializeAwareness(state.awareness.viewers, diagramID);

    state.awareness.viewers[diagramID] = viewers[diagramID].map(createViewer);
  });
});
