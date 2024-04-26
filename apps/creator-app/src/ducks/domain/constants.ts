import { createCRUDState } from '@/ducks/utils/crudV2';

import type { DomainState } from './types';

export const STATE_KEY = 'domain';

export const INITIAL_STATE: DomainState = {
  ...createCRUDState(),

  activeDomainID: null,
};
