import { createCRUDState } from '@/ducks/utils/crudV2';

import { DiagramAwarenessState, DiagramState } from './types';

export const STATE_KEY = 'diagramV2';

export const INITIAL_STATE: DiagramState = {
  ...createCRUDState(),
  awareness: {
    locks: {},
    viewers: {},
  },
  sharedNodes: {},
  globalIntentStepMap: {},
};

export const INITIAL_DIAGRAM_VIEWERS: DiagramAwarenessState['viewers'][string] = {
  byKey: {},
  allKeys: [],
};
