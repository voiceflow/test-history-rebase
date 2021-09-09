import { RealtimeDiagramAwarenessState, RealtimeDiagramState } from './types';

export const STATE_KEY = 'diagramV2';

export const INITIAL_DIAGRAM_STATE: RealtimeDiagramState = {
  awareness: {
    viewers: {},
    cursors: {},
  },
};

export const INITIAL_CURSORS: RealtimeDiagramAwarenessState['cursors'][string] = {};

export const INITIAL_DIAGRAM_VIEWERS: RealtimeDiagramAwarenessState['viewers'][string] = [];
