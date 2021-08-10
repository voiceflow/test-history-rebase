import * as CRUD from '@/ducks/utils/crud';

import { TranscriptState } from './types';

export const STATE_KEY = 'transcript';

export const INITIAL_STATE: TranscriptState = {
  ...CRUD.INITIAL_STATE,
  hasUnreadTranscripts: false,
};
