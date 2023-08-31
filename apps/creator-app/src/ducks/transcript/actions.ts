import { Utils } from '@voiceflow/common';
import { actionUtils } from '@voiceflow/realtime-sdk';

import { Transcript } from '@/models';

import { STATE_KEY } from './constants';

const transcriptTag = Utils.protocol.typeFactory(`${STATE_KEY}-action`);

export const crudActions = actionUtils.createCRUDActions<Transcript>(transcriptTag);

export const { replace: replaceTranscripts, patch: patchTranscript } = crudActions;

export const updateUnreadTranscripts = Utils.protocol.createAction<boolean>(transcriptTag('UPDATE_UNREAD_TRANSCRIPTS'));
