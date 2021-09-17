import { Node } from '@voiceflow/alexa-types';
import { PermissionType } from '@voiceflow/alexa-types/build/node';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

export const permissionStepDataFactory = define<Node.Permission.StepData>({
  permissions: () => [getRandomEnumElement(PermissionType)],
});

export const permissionNodeDataFactory = define<NodeData.Permission>({
  permissions: () => [getRandomEnumElement(PermissionType)],
});
