import { createCRUDState } from '@/ducks/utils/crudV2';

import type { ReportTagState } from './types';

export const STATE_KEY = 'reportTag';

export const INITIAL_STATE: ReportTagState = createCRUDState();
