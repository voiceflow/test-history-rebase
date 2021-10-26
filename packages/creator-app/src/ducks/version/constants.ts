import { createCRUDState } from '@/ducks/utils/crud';

import { VersionState } from './types';

export const STATE_KEY = 'version';

export const INITIAL_STATE: VersionState = createCRUDState();
