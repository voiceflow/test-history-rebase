import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { DOMAIN_KEY, TOPIC_KEY } from '@realtime-sdk/constants';
import { Diagram } from '@realtime-sdk/models';
import { BaseDomainPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { PrimitiveDiagram } from '@realtime-sdk/utils/diagram';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Required } from 'utility-types';

const domainType = Utils.protocol.typeFactory(DOMAIN_KEY);
const domainTopicType = Utils.protocol.typeFactory(domainType(TOPIC_KEY));

export interface CreatePayload extends BaseVersionPayload {
  domain: Omit<BaseModels.Version.Domain, 'id' | 'topicIDs' | 'rootDiagramID'>;
}

export interface DeleteWithNewVersionPayload extends BaseDomainPayload {}

export interface PatchPayload extends Partial<Omit<BaseModels.Version.Domain, 'id' | 'topicIDs | rootDiagramID'>> {}

export interface TopicCreatePayload extends BaseDomainPayload {
  topic: Required<Partial<PrimitiveDiagram>, 'name'>;
}

export interface TopicAddPayload extends BaseDomainPayload {
  topicID: string;
}

export interface TopicRemovePayload extends BaseDomainPayload {
  topicID: string;
}

export interface TopicReorderPayload extends BaseDomainPayload {
  toIndex: number;
  topicID: string;
}

export interface TopicConvertFromComponentPayload extends BaseDomainPayload {
  componentID: string;
}

export interface TopicMoveDomainPayload extends BaseDomainPayload {
  topicDiagramID: string;
  newDomainID: string;
  rootTopicID?: string;
}

export const crud = createCRUDActions<BaseModels.Version.Domain, BaseVersionPayload, PatchPayload>(domainType);

export const create = Utils.protocol.createAsyncAction<CreatePayload, BaseModels.Version.Domain>(domainType('CREATE'));
export const duplicate = Utils.protocol.createAsyncAction<BaseDomainPayload, BaseModels.Version.Domain>(domainType('DUPLICATE'));
export const deleteWithNewVersion = Utils.protocol.createAction<DeleteWithNewVersionPayload>(domainType('DELETE_WITH_NEW_VERSION'));

export const topicAdd = Utils.protocol.createAction<TopicAddPayload>(domainTopicType('ADD'));
export const topicCreate = Utils.protocol.createAsyncAction<TopicCreatePayload, Diagram>(domainTopicType('CREATE'));
export const topicRemove = Utils.protocol.createAction<TopicRemovePayload>(domainTopicType('REMOVE'));
export const topicReorder = Utils.protocol.createAction<TopicReorderPayload>(domainTopicType('REORDER'));
export const topicConvertFromComponent = Utils.protocol.createAsyncAction<TopicConvertFromComponentPayload, Diagram>(
  domainTopicType('CONVERT_FROM_COMPONENT')
);
export const topicMoveDomain = Utils.protocol.createAction<TopicMoveDomainPayload>(domainTopicType('MOVE_DOMAIN'));
