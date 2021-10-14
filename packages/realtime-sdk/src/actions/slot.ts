import { SLOT_KEY } from '../constants';
import { Slot } from '../models';
import { BaseVersionPayload } from '../types';
import { createCRUDActions, typeFactory } from './utils';

const slotType = typeFactory(SLOT_KEY);

// Other

// eslint-disable-next-line import/prefer-default-export
export const crud = createCRUDActions<BaseVersionPayload, Slot>(slotType);
