import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { DOMAIN_KEY } from '@realtime-sdk/constants';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

const domainType = Utils.protocol.typeFactory(DOMAIN_KEY);

export interface BaseDomainPayload extends BaseVersionPayload {}

export interface BaseTopicPayload extends BaseDomainPayload {
  domainID: string;
}

export interface TopicCreatePayload extends BaseTopicPayload {
  name: string;
}

export interface TopicRemovePayload extends BaseTopicPayload {}

export interface TopicReorderPayload extends BaseTopicPayload {
  fromID: string;
  toIndex: number;
}

export const crud = createCRUDActions<BaseModels.Version.Domain, BaseDomainPayload, Pick<BaseModels.Version.Domain, 'live' | 'name'>>(domainType);

export const topicCreate = Utils.protocol.createAction<TopicCreatePayload>(domainType('TOPIC_CREATE'));
export const topicRemove = Utils.protocol.createAction<TopicRemovePayload>(domainType('TOPIC_REMOVE'));
export const topicReorder = Utils.protocol.createAction<TopicReorderPayload>(domainType('TOPIC_REORDER'));
