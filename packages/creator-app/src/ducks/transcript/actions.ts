import { createAction } from '@/ducks/utils';
import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { Action } from '@/store/types';

import { STATE_KEY } from './constants';

const {
  add: addTranscript,
  addMany: addTranscripts,
  remove: removeTranscript,
  replace: replaceTranscripts,
  update: updateTranscript,
  patch: patchTranscript,
} = createCRUDActionCreators(STATE_KEY);

export { addTranscript, addTranscripts, patchTranscript, removeTranscript, replaceTranscripts, updateTranscript };

export type UpdateUnreadTranscripts = Action<TranscriptReadingAction.UPDATE_UNREAD_TRANSCRIPTS, boolean>;

export enum TranscriptReadingAction {
  UPDATE_UNREAD_TRANSCRIPTS = 'UPDATE_UNREAD_TRANSCRIPTS',
}

export const updateUnreadTranscripts = (hasUnreadTranscripts: boolean): UpdateUnreadTranscripts =>
  createAction(TranscriptReadingAction.UPDATE_UNREAD_TRANSCRIPTS, hasUnreadTranscripts);
