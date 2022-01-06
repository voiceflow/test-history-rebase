import { UTTERANCE_KEY } from '@ml-sdk/constants';
import { SuggestedUtterance } from '@ml-sdk/models';

import { createAsyncAction, createType } from './utils';

const utteranceType = createType(UTTERANCE_KEY);

export interface SuggestUtterancesPayload {
  projectID: string;
  intentID: string;
}

export const suggest = createAsyncAction<SuggestUtterancesPayload, SuggestedUtterance[]>(utteranceType('SUGGEST'));
