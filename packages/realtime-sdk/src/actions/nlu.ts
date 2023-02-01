import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { NLU_KEY } from '@realtime-sdk/constants';
import { NLUUnclassifiedData, NLUUnclassifiedUtterances } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const nluType = Utils.protocol.typeFactory(NLU_KEY);

export interface BaseNLUUnclassifiedDataPayload extends BaseVersionPayload {}

export interface ReloadPayload extends BaseNLUUnclassifiedDataPayload {
  nluUnclassifiedData: NLUUnclassifiedData[];
}

export interface RemoveManyUtterancesPayload extends BaseNLUUnclassifiedDataPayload {
  utterances: NLUUnclassifiedUtterances[];
}

export interface UpdateManyUtterancesPayload extends BaseNLUUnclassifiedDataPayload {
  utterances: NLUUnclassifiedUtterances[];
}

export const crud = createCRUDActions<NLUUnclassifiedData, BaseNLUUnclassifiedDataPayload>(nluType);

export const reload = Utils.protocol.createAction<ReloadPayload>(nluType('RELOAD'));

export const removeManyUtterances = Utils.protocol.createAction<RemoveManyUtterancesPayload>(nluType('REMOVE_MANY_UTTERANCES'));

export const updateManyUtterances = Utils.protocol.createAction<RemoveManyUtterancesPayload>(nluType('UPDATE_MANY_UTTERANCES'));
