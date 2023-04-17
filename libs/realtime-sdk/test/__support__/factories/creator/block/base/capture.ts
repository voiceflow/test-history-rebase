import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

export const CaptureStepData = define<Omit<BaseNode.Capture.StepData, 'noReply'>>({
  slot: () => '',
  variable: () => lorem.word(),
  slotInputs: () => [datatype.uuid()],
});

export const CaptureNodeData = define<Omit<NodeData.Capture, 'buttons' | 'noReply'>>({
  slot: () => datatype.uuid(),
  examples: () => [datatype.uuid()],
  variable: () => lorem.word(),
});
