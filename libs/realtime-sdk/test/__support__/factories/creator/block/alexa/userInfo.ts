import { faker } from '@faker-js/faker';
import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

export const UserInfo = define<AlexaNode.UserInfo.UserInfo>({
  type: () => getRandomEnumElement(AlexaNode.PermissionType),
  mapTo: () => faker.datatype.uuid(),
  product: () => faker.lorem.word(),
});

export const UserPermission = define<NodeData.UserInfoPermission>({
  id: () => faker.datatype.uuid(),
  mapTo: () => faker.datatype.uuid(),
  product: () => faker.lorem.word(),
  selected: () => getRandomEnumElement(AlexaNode.PermissionType),
});

export const UserInfoStepData = define<AlexaNode.UserInfo.StepData>({
  infos: () => [UserInfo()],
});

export const UserInfoNodeData = define<NodeData.UserInfo>({
  permissions: () => [UserPermission()],
});
