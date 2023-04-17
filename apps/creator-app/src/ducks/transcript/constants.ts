import { createCRUDState } from '@/ducks/utils/crud';

import { TranscriptState } from './types';

export const STATE_KEY = 'transcript';

export const INITIAL_STATE: TranscriptState = {
  ...createCRUDState(),
  hasUnreadTranscripts: false,
};
