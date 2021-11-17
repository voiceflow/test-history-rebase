import { getRandomEnumElement } from '@test/utils';
import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';

export const PermissionStepData = define<Node.Permission.StepData>({
  permissions: () => [getRandomEnumElement(Node.PermissionType)],
});

export const PermissionNodeData = define<NodeData.Permission>({
  permissions: () => [getRandomEnumElement(Node.PermissionType)],
});
