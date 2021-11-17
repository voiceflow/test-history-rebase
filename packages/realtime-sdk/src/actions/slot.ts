import { Utils } from '@voiceflow/common';

import { SLOT_KEY } from '../constants';
import { Slot } from '../models';
import { BaseVersionPayload } from '../types';
import { createCRUDActions } from './utils';

const slotType = Utils.protocol.typeFactory(SLOT_KEY);

// Other

// eslint-disable-next-line import/prefer-default-export
export const crud = createCRUDActions<BaseVersionPayload, Slot>(slotType);
