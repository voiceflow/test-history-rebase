import { Transcript } from '@/models';
import { RootReducer } from '@/store/types';

import { compositeReducer } from '../utils';
import createCRUDReducer from '../utils/crud';
import { TranscriptReadingAction, UpdateUnreadTranscripts } from './actions';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

const transcriptCRUDReducer = createCRUDReducer<Transcript>(STATE_KEY);

const updateUnreadTranscriptReducer: RootReducer<boolean, UpdateUnreadTranscripts> = (state = false, action) => {
  if (action.type === TranscriptReadingAction.UPDATE_UNREAD_TRANSCRIPTS) {
    return action.payload;
  }

  return state;
};

const transcriptReducer = compositeReducer(transcriptCRUDReducer, { hasUnreadTranscripts: updateUnreadTranscriptReducer });

export default transcriptReducer;
