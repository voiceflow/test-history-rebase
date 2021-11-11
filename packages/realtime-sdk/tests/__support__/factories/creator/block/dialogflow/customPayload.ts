import { Node } from '@voiceflow/google-dfes-types';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

import { NodeData } from '@/models';

export const CustomPayloadStep = define<Node.Payload.StepData>({
  data: () => [],
});

export const CustomPayloadNodeData = define<NodeData.CustomPayload>({
  customPayload: () => ({ myNewAttribute: lorem.word() }),
});
