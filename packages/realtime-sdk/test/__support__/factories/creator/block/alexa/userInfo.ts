import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

export const UserInfo = define<AlexaNode.UserInfo.UserInfo>({
  type: () => getRandomEnumElement(AlexaNode.PermissionType),
  mapTo: () => datatype.uuid(),
  product: () => lorem.word(),
});

export const UserPermission = define<NodeData.UserInfoPermission>({
  id: () => datatype.uuid(),
  mapTo: () => datatype.uuid(),
  product: () => lorem.word(),
  selected: () => getRandomEnumElement(AlexaNode.PermissionType),
});

export const UserInfoStepData = define<AlexaNode.UserInfo.StepData>({
  infos: () => [UserInfo()],
});

export const UserInfoNodeData = define<NodeData.UserInfo>({
  permissions: () => [UserPermission()],
});
