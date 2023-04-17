import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

export const PermissionStepData = define<AlexaNode.Permission.StepData>({
  permissions: () => [getRandomEnumElement(AlexaNode.PermissionType)],
});

export const PermissionNodeData = define<NodeData.Permission>({
  permissions: () => [getRandomEnumElement(AlexaNode.PermissionType)],
});
