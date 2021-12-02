import { Node } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const CaptureStepData = define<Omit<Node.Capture.StepData, 'noReply'>>({
  slot: () => '',
  variable: () => lorem.word(),
  slotInputs: () => [datatype.uuid()],
});

export const CaptureNodeData = define<Omit<NodeData.Capture, 'buttons' | 'noReply'>>({
  slot: () => datatype.uuid(),
  examples: () => [datatype.uuid()],
  variable: () => lorem.word(),
});
