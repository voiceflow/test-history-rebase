import { INTENT_KEY } from '../constants';
import { Intent } from '../models';
import { BaseVersionPayload } from '../types';
import { createCRUDActions, typeFactory } from './utils';

const intentType = typeFactory(INTENT_KEY);

// Other

// eslint-disable-next-line import/prefer-default-export
export const crud = createCRUDActions<BaseVersionPayload, Intent>(intentType);
