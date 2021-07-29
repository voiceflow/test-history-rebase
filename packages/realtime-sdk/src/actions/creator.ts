import { CREATOR_KEY } from '../constants';
import { BaseCreatorPayload } from '../types';
import { createAction, typeFactory } from './utils';

const creatorType = typeFactory(CREATOR_KEY);

// Other

export interface ActionProcessedPayload<T = any> extends BaseCreatorPayload {
  data: T;
  actionID: string;
}

export const actionProcessed = createAction<ActionProcessedPayload>(creatorType('ACTION_PROCESSED'));
