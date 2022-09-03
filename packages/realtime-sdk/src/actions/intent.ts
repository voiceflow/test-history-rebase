import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { INTENT_KEY } from '@realtime-sdk/constants';
import { Intent } from '@realtime-sdk/models';
import { BaseVersionPayload, ProjectMetaPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const intentType = Utils.protocol.typeFactory(INTENT_KEY);

export interface BaseIntentPayload extends BaseVersionPayload, ProjectMetaPayload {}

export interface ReloadPayload extends BaseIntentPayload {
  intents: Intent[];
}

export const crud = createCRUDActions<Intent, BaseIntentPayload>(intentType);

export const reload = Utils.protocol.createAction<ReloadPayload>(intentType('RELOAD'));
