import { TRANSCRIPT_KEY } from '@realtime-sdk/constants';
import { Thread } from '@realtime-sdk/models';
import { BaseProjectPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const transcriptType = Utils.protocol.typeFactory(TRANSCRIPT_KEY);

export const crud = createCRUDActions<Thread, BaseProjectPayload>(transcriptType);
