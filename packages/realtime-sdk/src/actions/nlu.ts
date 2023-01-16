import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { NLU_KEY } from '@realtime-sdk/constants';
import { NLUUnclassifiedData } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const nluType = Utils.protocol.typeFactory(NLU_KEY);

export interface BaseNLUUnclassifiedDataPayload extends BaseVersionPayload {}

export interface ReloadPayload extends BaseNLUUnclassifiedDataPayload {
  nluUnclassifiedData: NLUUnclassifiedData[];
}

export const crud = createCRUDActions<NLUUnclassifiedData, BaseNLUUnclassifiedDataPayload>(nluType);

export const reload = Utils.protocol.createAction<ReloadPayload>(nluType('RELOAD'));
