import { createCRUDState } from '@/ducks/utils/crudV2';

import type { ProjectState } from './types';

export const STATE_KEY = 'projectV2';

export const INITIAL_STATE: ProjectState = {
  ...createCRUDState(),
  awareness: {
    viewers: {},
  },
};
