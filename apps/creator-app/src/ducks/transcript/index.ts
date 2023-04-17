import * as Realtime from '@voiceflow/realtime-sdk';
import compositeReducer from 'composite-reducer';
import * as Normal from 'normal-store';

import { Transcript } from '@/models';
import { RootReducer } from '@/store/types';

import createCRUDReducer, { AnyCRUDAction, createCRUDState, CRUDState } from '../utils/crud';
import { TranscriptReadingAction, UpdateUnreadTranscripts } from './actions';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

const _transcriptCRUDReducer = createCRUDReducer<Transcript>(STATE_KEY);

// TODO: move everything over to Realtime.transcript.crud
const transcriptCRUDReducer: RootReducer<CRUDState<Transcript>, AnyCRUDAction<Transcript>> = (state = createCRUDState(), action) => {
  if (action.type === Realtime.transcript.crud.remove.type) {
    return Normal.removeOne(state, (action.payload as any).key);
  }

  return _transcriptCRUDReducer(state, action);
};

const updateUnreadTranscriptReducer: RootReducer<boolean, UpdateUnreadTranscripts> = (state = false, action) => {
  if (action.type === TranscriptReadingAction.UPDATE_UNREAD_TRANSCRIPTS) {
    return action.payload;
  }

  return state;
};

const transcriptReducer = compositeReducer(transcriptCRUDReducer, { hasUnreadTranscripts: updateUnreadTranscriptReducer });

export default transcriptReducer;
