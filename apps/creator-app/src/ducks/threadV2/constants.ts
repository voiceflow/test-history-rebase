import { createCRUDState } from '@/ducks/utils/crudV2';

import { ThreadState } from './types';

export const STATE_KEY = 'threadV2';

export const INITIAL_STATE: ThreadState = { ...createCRUDState(), hasUnreadComments: false };
