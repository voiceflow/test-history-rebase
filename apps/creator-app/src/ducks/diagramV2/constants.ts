import type { ProjectAwarenessState } from '@/ducks/projectV2/types';
import { createCRUDState } from '@/ducks/utils/crudV2';

import type { DiagramState } from './types';

export const STATE_KEY = 'diagramV2';

export const INITIAL_STATE: DiagramState = {
  ...createCRUDState(),
  awareness: { locks: {} },
  sharedNodes: {},
  lastCreatedID: null,
  globalIntentStepMap: {},
};

export const INITIAL_DIAGRAM_VIEWERS: ProjectAwarenessState['viewers'][string]['string'] = {
  byKey: {},
  allKeys: [],
};
