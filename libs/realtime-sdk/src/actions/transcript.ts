import { TRANSCRIPT_KEY } from '@realtime-sdk/constants';
import { BaseProjectPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { Thread } from '@voiceflow/dtos';

import { createCRUDActions } from './utils';

const transcriptType = Utils.protocol.typeFactory(TRANSCRIPT_KEY);

export const crud = createCRUDActions<Thread, BaseProjectPayload>(transcriptType);

export interface UpdateUnreadTranscriptsPayload extends BaseProjectPayload {
  unreadTranscripts: boolean;
}

export const updateUnreadTranscripts = Utils.protocol.createAction<UpdateUnreadTranscriptsPayload>(transcriptType('UPDATE_UNREAD_TRANSCRIPTS'));
