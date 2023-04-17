import { createCRUDState } from '@/ducks/utils/crudV2';

import { VersionState } from './types';

export const STATE_KEY = 'versionV2';

export const INITIAL_STATE: VersionState = createCRUDState();
