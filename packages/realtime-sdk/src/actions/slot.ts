import { SLOT_KEY } from '@realtime-sdk/constants';
import { Slot } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const slotType = Utils.protocol.typeFactory(SLOT_KEY);

export interface ReloadPayload extends BaseVersionPayload {
  slots: Slot[];
}

// Other

export const crud = createCRUDActions<Slot, BaseVersionPayload>(slotType);

export const reload = Utils.protocol.createAction<ReloadPayload>(slotType('RELOAD'));
