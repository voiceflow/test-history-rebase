import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { INTENT_KEY } from '@realtime-sdk/constants';
import { Intent } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const intentType = Utils.protocol.typeFactory(INTENT_KEY);

// Other

// eslint-disable-next-line import/prefer-default-export
export const crud = createCRUDActions<Intent, BaseVersionPayload>(intentType);
