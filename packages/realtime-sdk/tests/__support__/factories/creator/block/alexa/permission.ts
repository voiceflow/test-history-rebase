import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import { NodeData } from '@/models';
import { getRandomEnumElement } from '@/tests/utils';

export const PermissionStepData = define<Node.Permission.StepData>({
  permissions: () => [getRandomEnumElement(Node.PermissionType)],
});

export const PermissionNodeData = define<NodeData.Permission>({
  permissions: () => [getRandomEnumElement(Node.PermissionType)],
});
