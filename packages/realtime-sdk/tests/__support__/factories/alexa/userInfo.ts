import { Node } from '@voiceflow/alexa-types';
import { PermissionType } from '@voiceflow/alexa-types/build/node';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

export const infoFactory = define<Node.UserInfo.UserInfo>({
  mapTo: () => datatype.uuid(),
  product: () => lorem.word(),
  type: () => getRandomEnumElement(PermissionType),
});

export const permissionFactory = define<NodeData.UserInfoPermission>({
  mapTo: () => datatype.uuid(),
  product: () => lorem.word(),
  id: () => datatype.uuid(),
  selected: () => getRandomEnumElement(PermissionType),
});

export const userInfoStepDataFactory = define<Node.UserInfo.StepData>({
  infos: () => [infoFactory()],
});

export const userInfoNodeData = define<NodeData.UserInfo>({
  permissions: () => [permissionFactory()],
});
