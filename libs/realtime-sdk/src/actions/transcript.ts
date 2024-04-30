import { Utils } from '@voiceflow/common';
import type { Thread } from '@voiceflow/dtos';

import { TRANSCRIPT_KEY } from '@/constants';
import type { BaseProjectPayload } from '@/types';

import { createCRUDActions } from './utils';

const transcriptType = Utils.protocol.typeFactory(TRANSCRIPT_KEY);

export const crud = createCRUDActions<Thread, BaseProjectPayload>(transcriptType);

export interface UpdateUnreadTranscriptsPayload extends BaseProjectPayload {
  unreadTranscripts: boolean;
}

export const updateUnreadTranscripts = Utils.protocol.createAction<UpdateUnreadTranscriptsPayload>(
  transcriptType('UPDATE_UNREAD_TRANSCRIPTS')
);
