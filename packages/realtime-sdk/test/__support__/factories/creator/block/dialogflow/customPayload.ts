import { NodeData } from '@realtime-sdk/models';
import { DFESNode } from '@voiceflow/google-dfes-types';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

export const CustomPayloadStep = define<DFESNode.Payload.StepData>({
  data: () => [],
});

export const CustomPayloadNodeData = define<NodeData.CustomPayload>({
  customPayload: () => ({ myNewAttribute: lorem.word() }),
});
