import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { INTENT_KEY } from '@realtime-sdk/constants';
import { BaseVersionPayload, ProjectMetaPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';

const intentType = Utils.protocol.typeFactory(INTENT_KEY);

export interface BaseIntentPayload extends BaseVersionPayload, ProjectMetaPayload {}

export interface ReloadPayload extends BaseIntentPayload {
  intents: Platform.Base.Models.Intent.Model[];
}

export const crud = createCRUDActions<Platform.Base.Models.Intent.Model, BaseIntentPayload>(intentType);

export const reload = Utils.protocol.createAction<ReloadPayload>(intentType('RELOAD'));
