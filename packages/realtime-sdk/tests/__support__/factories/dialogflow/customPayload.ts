import { Node } from '@voiceflow/google-dfes-types';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

import { NodeData } from '@/models';

export const payloadStepFactory = define<Node.Payload.StepData>({
  data: () => [],
});

export const payloadNodeDataFactory = define<NodeData.CustomPayload>({
  customPayload: () => ({ myNewAtribute: lorem.word() }),
});
