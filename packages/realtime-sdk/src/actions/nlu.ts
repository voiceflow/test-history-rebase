import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { NLU_KEY } from '@realtime-sdk/constants';
import { NluUnclassifiedData } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const nluType = Utils.protocol.typeFactory(NLU_KEY);

export interface BaseNLUUnclassifiedDataPayload extends BaseVersionPayload {}

export interface ReloadPayload extends BaseNLUUnclassifiedDataPayload {
  nluUnclassifiedData: NluUnclassifiedData[];
}

export const crud = createCRUDActions<NluUnclassifiedData, BaseNLUUnclassifiedDataPayload>(nluType);

export const reload = Utils.protocol.createAction<ReloadPayload>(nluType('RELOAD'));
