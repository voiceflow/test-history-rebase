import { Utils } from '@voiceflow/common';

import { INTENT_KEY } from '../constants';
import { Intent } from '../models';
import { BaseVersionPayload } from '../types';
import { createCRUDActions } from './utils';

const intentType = Utils.protocol.typeFactory(INTENT_KEY);

// Other

// eslint-disable-next-line import/prefer-default-export
export const crud = createCRUDActions<BaseVersionPayload, Intent>(intentType);
