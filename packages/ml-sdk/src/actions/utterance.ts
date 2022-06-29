import { UTTERANCE_KEY } from '@ml-sdk/constants';

import { createAsyncAction, createType } from './utils';

const utteranceType = createType(UTTERANCE_KEY);

export interface SuggestPayload {
  utterance: string;
  numberOfUtterances: number;
}

export const suggest = createAsyncAction<SuggestPayload, string[]>(utteranceType('SUGGEST'));
