import { UTTERANCE_KEY } from '@ml-sdk/constants';
import { SuggestedUtterance } from '@ml-sdk/models';
import { Utils } from '@voiceflow/common';

const utteranceType = Utils.protocol.typeFactory(UTTERANCE_KEY);

export interface SuggestUtterancesPayload {
  projectID: string;
  intentID: string;
}

export const suggest = Utils.protocol.createAction.async<SuggestUtterancesPayload, SuggestedUtterance[]>(utteranceType('SUGGEST'));
