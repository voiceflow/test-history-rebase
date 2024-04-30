import { getRandomEnumElement } from '@test/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import type { NodeData } from '@/models';

export const PermissionStepData = define<AlexaNode.Permission.StepData>({
  permissions: () => [getRandomEnumElement(AlexaNode.PermissionType)],
});

export const PermissionNodeData = define<NodeData.Permission>({
  permissions: () => [getRandomEnumElement(AlexaNode.PermissionType)],
});
