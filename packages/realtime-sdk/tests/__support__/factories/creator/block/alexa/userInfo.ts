import { getRandomEnumElement } from '@test/utils';
import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const UserInfo = define<Node.UserInfo.UserInfo>({
  type: () => getRandomEnumElement(Node.PermissionType),
  mapTo: () => datatype.uuid(),
  product: () => lorem.word(),
});

export const UserPermission = define<NodeData.UserInfoPermission>({
  id: () => datatype.uuid(),
  mapTo: () => datatype.uuid(),
  product: () => lorem.word(),
  selected: () => getRandomEnumElement(Node.PermissionType),
});

export const UserInfoStepData = define<Node.UserInfo.StepData>({
  infos: () => [UserInfo()],
});

export const UserInfoNodeData = define<NodeData.UserInfo>({
  permissions: () => [UserPermission()],
});
