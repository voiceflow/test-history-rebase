import { createCRUDState } from '@/ducks/utils/crudV2';

import { TranscriptState } from './types';

export const STATE_KEY = 'transcript';

export const INITIAL_STATE: TranscriptState = {
  ...createCRUDState(),
  hasUnreadTranscripts: false,
};
